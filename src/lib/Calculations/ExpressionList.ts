import Big from "big.js";
import {
  Expression,
  NumberExpression,
  OperatorExpression,
  ParenthesisExpression,
} from "./Expression";

type ExpressionListItem = Expression | ExpressionList;

export class ExpressionList {
  public readonly expressions: ExpressionListItem[];

  constructor(data?: string | ExpressionListItem[]) {
    if (!data) {
      this.expressions = [];
    } else if (typeof data === "string") {
      this.expressions = ExpressionList.parseString(data);
    } else {
      this.expressions = data;
    }
  }

  /**
   * Validate an expression list type
   */
  static is(val: any): val is ExpressionList {
    return val instanceof ExpressionList;
  }

  /**
   * Append expressions immutably
   */
  append(...expressions: ExpressionListItem[]) {
    return new ExpressionList(this.expressions.concat(...expressions));
  }

  /**
   * Recursive stringification
   */
  toString(): string {
    return `[! ${this.expressions.map((_) => _.toString()).join(" ")} ]`;
  }

  /**
   * Shorthand to the static evaluation method
   *
   * @throws
   */
  evaluate() {
    return ExpressionList.evaluate(this.expressions);
  }

  /**
   * Shorthand to the static evaluation method with conversion. All errors
   * are handled as NaNs
   */
  evaluateToNumber() {
    try {
      const value = ExpressionList.evaluate(this.expressions).toNumber();
      if (value === undefined) return NaN;
      return value;
    } catch (e) {
      return NaN;
    }
  }

  /**
   * Parses a list of expressions such that each parenthesis group is parsed to
   * a recursive expression list.
   */
  static parseParenthesis(list: ExpressionListItem[]): ExpressionList {
    // Automatically return empty for empty
    if (list.length === 0) {
      return new ExpressionList();
    }

    // Stack to contain each expression list level
    const stack: ExpressionList[] = [new ExpressionList()];

    // Parse each indented level of parenthesis to a new expression list
    // by using the stack
    for (let i = 0; i < list.length; i++) {
      const expr = list[i];

      // Push to stack new expression list level
      if (ParenthesisExpression.isOpening(expr)) {
        stack.push(new ExpressionList([]));
      }

      // Pop from stack and append latest expression list to previous level
      else if (ParenthesisExpression.isClosing(expr)) {
        // Do nothing for too many closing parenthesis
        if (stack.length > 1) {
          const topStack = stack.pop();
          // Should always pass
          if (topStack) {
            stack[stack.length - 1] = stack[stack.length - 1].append(topStack);
          }
        }
      }

      // Else append other expressions to top stack
      else {
        stack[stack.length - 1] = stack[stack.length - 1].append(expr);
      }
    }

    return stack[0];
  }

  /**
   * Evaluates a full list of expressions into a number or NaN if evaluation
   * failed.
   */
  static evaluate(rawlist: ExpressionListItem[]): Big {
    // Parse to recursive list of expressions and expression lists
    const list = ExpressionList.parseParenthesis(rawlist).expressions;

    // Empty lists are considered invalid and automatically fail
    if (list.length === 0) {
      throw new Error("Parsed list was empty");
    }

    // Attempt condensing first unary negation operator if one exists by
    // replacing it and the following number by the negation of that number.
    if (
      OperatorExpression.isSubtraction(list[0]) &&
      (NumberExpression.is(list[1]) || ExpressionList.is(list[1]))
    ) {
      const number = toNumberExpression(list[1]);
      list.splice(0, 2, number.multiply(new Big(-1)));
    }

    // If last item in list is an operator, append the operator's identity
    const last = list[list.length - 1];
    if (OperatorExpression.is(last)) {
      list.push(last.getIdentity());
    }

    // List must have an odd length to be valid
    if (list.length % 2 === 0) {
      throw new Error("List has even length");
    }

    // All even indexed entries must be numbers or expression lists and all odd
    // indexed entries must be operators.
    if (
      !list.every((expr, index) =>
        index % 2 === 0
          ? NumberExpression.is(expr) || ExpressionList.is(expr)
          : OperatorExpression.is(expr)
      )
    ) {
      throw new Error("Invalid order of expression types in list");
    }

    // Perform all operations in order
    while (list.length > 1) {
      // Find first operator of highest priority and its index
      let [op, opIndex] = list.reduce(
        (res, expr, i) => {
          // Skip non-operators
          if (!OperatorExpression.is(expr)) {
            return res;
          }

          // If first operator, automatically return this operator
          if (!res[0]) {
            return [expr, i];
          }

          // If operator has higher priority than current highest, replace
          if (expr.getOrder() > res[0].getOrder()) {
            return [expr, i];
          }

          // Else keep current
          return res;
        },
        [null, -1] as [null | OperatorExpression, number]
      );

      // Ensure valid operator found
      if (!op || opIndex < 0) {
        throw new Error("Unable to find operator in list");
      }

      // Find operands
      const a = list[opIndex - 1];
      const b = list[opIndex + 1];

      // Ensure operands are numbers or expression lists
      if (
        !(NumberExpression.is(a) || ExpressionList.is(a)) ||
        !(NumberExpression.is(b) || ExpressionList.is(b))
      ) {
        throw new Error("Could not find numeric operands for operator in list");
      }

      // Convert operands to number expressions
      const numA = toNumberExpression(a);
      const numB = toNumberExpression(b);

      // Perform operation and replace operands and operator in array
      // with result
      const result = op.evaluate(numA, numB);
      list.splice(opIndex - 1, 3, result);
    }

    // List should have only one expression remaining.
    if (list.length !== 1) {
      throw new Error("List had invalid length after parsing");
    }

    // Last expression in list should be a number or expression list.
    if (!NumberExpression.is(list[0]) && !ExpressionList.is(list[0])) {
      throw new Error("Parsed value in list was not number or expression list");
    }

    // Return value of number or expression list
    return toNumberExpression(list[0]).value;
  }

  /**
   * Parse a string to a list of expressions.
   *
   * Also performs the following operations.
   * - Automatically insert missing closing parenthesis.
   * - Transforms all implicit multiplications to explicit.
   */
  static parseString(str: string): Expression[] {
    // List of all parsed expressions
    const expressions: Expression[] = [];

    // Accumulator for recording number strings
    let acc = "";

    // Utility function to flush accumulator
    function flushAcc(): boolean {
      // Do nothing if no accumulator
      if (!acc) return false;

      try {
        // Parse value
        const value = new Big(acc);
        parseFloat(acc);

        // Append new expression, reset acc and return true to signal
        // success
        expressions.push(new NumberExpression(value));
        acc = "";
        return true;
      } catch (e) {
        // Invalid numbers will not be appended, reset acc on invalid
        acc = "";
        return false;
      }
    }

    // Iterate over characters
    for (const char of Array.from(str)) {
      // Accumulate numbers
      if (char.match(/\d|\./)) {
        acc += char;
        continue;
      }

      // Flush acc
      const insertedNumber = flushAcc();

      // Match expression
      switch (char) {
        // Addition operator
        case "+": {
          expressions.push(new OperatorExpression("+"));
          break;
        }

        // Subtraction operator
        case "-": {
          expressions.push(new OperatorExpression("-"));
          break;
        }

        // Division operator
        case "/": {
          expressions.push(new OperatorExpression("/"));
          break;
        }

        // Multiplication operator
        case "*": {
          expressions.push(new OperatorExpression("*"));
          break;
        }

        // Opening parenthesis
        case "(": {
          // Add an explicit multiplication when implicit multiplication deteted
          if (insertedNumber) {
            expressions.push(new OperatorExpression("*"));
          }

          expressions.push(new ParenthesisExpression("("));
          break;
        }

        case ")": {
          expressions.push(new ParenthesisExpression(")"));
          break;
        }
      }
    }

    // Final flush
    flushAcc();

    // Count amount of missing closing parenthesis
    let nMissingParenthesis = 0;
    for (const expression of expressions) {
      if (expression instanceof ParenthesisExpression) {
        if (expression.isOpening()) {
          nMissingParenthesis += 1;
        } else {
          nMissingParenthesis -= 1;
        }
      }
    }

    // Insert all missing parenthesis expressions
    for (let i = 0; i < nMissingParenthesis; i++) {
      expressions.push(new ParenthesisExpression(")"));
    }

    // Return all expressions as list
    return expressions;
  }
}

// Helper function to convert a number, number expression or expression list
// to a number expression.
function toNumberExpression(
  val: number | NumberExpression | ExpressionList
): NumberExpression {
  if (typeof val === "number") {
    return new NumberExpression(val);
  } else if (ExpressionList.is(val)) {
    return new NumberExpression(val.evaluate());
  } else {
    return val;
  }
}
