import { ExpressionList } from "./ExpressionList";

export type CalculatorFunction =
  | "no0"
  | "no1"
  | "no2"
  | "no3"
  | "no4"
  | "no5"
  | "no6"
  | "no7"
  | "no8"
  | "no9"
  | "dot"
  | "clr"
  | "add"
  | "sub"
  | "mul"
  | "div"
  | "par"
  | "pro"
  | "prc"
  | "clr"
  | "bck"
  | "eql";

export class Calculation {
  public readonly value: number;
  public readonly isValid: boolean;
  public readonly str: string;
  public readonly expressionList: ExpressionList;

  constructor(str: string) {
    this.str = str;
    this.expressionList = new ExpressionList(str);
    this.value = str ? this.expressionList.evaluateToNumber() : 0;
    this.isValid = !Number.isNaN(this.value);
  }

  /**
   * Map of all characters from operation to symbol for appending them
   * to the string.
   */
  protected static SymbolMap: Record<CalculatorFunction, string> = {
    no0: "0",
    no1: "1",
    no2: "2",
    no3: "3",
    no4: "4",
    no5: "5",
    no6: "6",
    no7: "7",
    no8: "8",
    no9: "9",
    add: "+",
    sub: "-",
    mul: "*",
    div: "/",
    dot: ".",
    pro: "(",
    prc: ")",
    par: "",
    eql: "",
    clr: "",
    bck: "",
  };

  /**
   * Count parenthesis and return the next parenthesis. If no parenthesis in
   * string or all pair sclosed, returns opening parenthesis ("("). If unclosed
   * parenthesis exists, returns closing parenthesis (")").
   */
  static getNextParenthesis(str: string) {
    return Array.from(str).reduce((parenthesis, char) => {
      if (char === parenthesis) {
        return parenthesis === "(" ? ")" : "(";
      }
      return parenthesis;
    }, "(");
  }

  /**
   * Create new calculation based on operation.
   */
  input(fn: CalculatorFunction): Calculation {
    switch (fn) {
      // Back removes the last character from the string.
      case "bck": {
        return new Calculation(this.str.substring(0, this.str.length - 1));
      }

      // Equal (when valid expression exists) replaces the input string with the
      // constant value that is equal to the output.
      case "eql": {
        if (this.value) {
          return new Calculation(this.value.toString());
        } else {
          return new Calculation(this.str);
        }
      }

      // Add parenthesis by getting the next opening or closing parenthesis.
      case "par": {
        return new Calculation(
          this.str + Calculation.getNextParenthesis(this.str)
        );
      }

      // Clear by removing all strings.
      case "clr": {
        return new Calculation("");
      }

      // All other operations are performed by appending the correct character
      // to the calculation string.
      default: {
        return new Calculation(this.str + Calculation.SymbolMap[fn]);
      }
    }
  }

  /**
   * Get the input value (formatted string) of the calculation.
   */
  formatInput() {
    let formatted = this.str
      .replace(/\+/g, " + ")
      .replace(/-/g, " - ")
      .replace(/\*/g, " × ")
      .replace(/\//g, " ÷ ")
      .replace(/\(/g, " (")
      .replace(/\)/g, ") ")
      .trim();

    return formatted;
  }

  /**
   * Get the function corresponding to a number. Input must be a valid integer
   * between 0 and 9.
   */
  static Number(num: number): CalculatorFunction {
    switch (num) {
      case 0:
        return "no0";
      case 1:
        return "no1";
      case 2:
        return "no2";
      case 3:
        return "no3";
      case 4:
        return "no4";
      case 5:
        return "no5";
      case 6:
        return "no6";
      case 7:
        return "no7";
      case 8:
        return "no8";
      case 9:
        return "no9";
      default:
        throw Error(`Number must be integer between 0 and 9, was ${num}`);
    }
  }

  /**
   * List of all functions
   */
  static Function = {
    CLEAR: "clr" as CalculatorFunction,
    BACK: "bck" as CalculatorFunction,
    EQUALS: "eql" as CalculatorFunction,
    DOT: "dot" as CalculatorFunction,
    ADD: "add" as CalculatorFunction,
    SUBTRACT: "sub" as CalculatorFunction,
    MULTIPLY: "mul" as CalculatorFunction,
    DIVIDE: "div" as CalculatorFunction,
    PARENTHESIS: "par" as CalculatorFunction,
    OPEN: "pro" as CalculatorFunction,
    CLOSE: "prc" as CalculatorFunction,
  } as const;
}
