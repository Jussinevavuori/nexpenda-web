import { Big } from "big.js";

export type ExpressionType = "number" | "parenthesis" | "operator";

export abstract class Expression {
  abstract type: ExpressionType;
}

export class NumberExpression extends Expression {
  value: Big;
  type: ExpressionType;

  constructor(value: Big | string | number) {
    super();
    this.value =
      typeof value === "string" || typeof value === "number"
        ? new Big(value)
        : value;
    this.type = "number";
  }

  add(value: Big) {
    return new NumberExpression(this.value.add(value));
  }

  multiply(value: Big) {
    return new NumberExpression(this.value.mul(value));
  }

  static is(val: any): val is NumberExpression {
    return val instanceof NumberExpression;
  }

  toString() {
    return `${this.value.toString()}`;
  }
}

export class ParenthesisExpression extends Expression {
  value: "(" | ")";
  type: ExpressionType;

  constructor(value: "(" | ")") {
    super();
    this.value = value;
    this.type = "parenthesis";
  }

  isOpening() {
    return this.value === "(";
  }

  isClosing() {
    return this.value === ")";
  }

  static is(val: any): val is ParenthesisExpression {
    return val instanceof ParenthesisExpression;
  }

  static isOpening(val: any): val is ParenthesisExpression {
    return val instanceof ParenthesisExpression && val.isOpening();
  }

  static isClosing(val: any): val is ParenthesisExpression {
    return val instanceof ParenthesisExpression && val.isClosing();
  }

  toString() {
    return `${this.value.toString()}`;
  }
}

export type Operator = "+" | "-" | "*" | "/";

export class OperatorExpression extends Expression {
  value: Operator;
  type: ExpressionType;

  constructor(value: Operator) {
    super();
    this.value = value;
    this.type = "operator";
  }

  evaluate(a: Big | NumberExpression, b: Big | NumberExpression) {
    let _a = NumberExpression.is(a) ? a.value : a;
    let _b = NumberExpression.is(b) ? b.value : b;
    switch (this.value) {
      case "+":
        return new NumberExpression(_a.add(_b));
      case "-":
        return new NumberExpression(_a.sub(_b));
      case "*":
        return new NumberExpression(_a.mul(_b));
      case "/":
        return new NumberExpression(_a.div(_b));
    }
  }

  getOrder() {
    switch (this.value) {
      case "+":
        return 1;
      case "-":
        return 1;
      case "*":
        return 2;
      case "/":
        return 2;
    }
  }

  getIdentity() {
    switch (this.value) {
      case "+":
        return new NumberExpression("0");
      case "-":
        return new NumberExpression("0");
      case "*":
        return new NumberExpression("1");
      case "/":
        return new NumberExpression("1");
    }
  }

  static is(val: any): val is OperatorExpression {
    return val instanceof OperatorExpression;
  }

  static isAddition(val: any): val is OperatorExpression {
    return val instanceof OperatorExpression && val.value === "+";
  }

  static isSubtraction(val: any): val is OperatorExpression {
    return val instanceof OperatorExpression && val.value === "-";
  }

  static isMultiplication(val: any): val is OperatorExpression {
    return val instanceof OperatorExpression && val.value === "*";
  }

  static isDivision(val: any): val is OperatorExpression {
    return val instanceof OperatorExpression && val.value === "/";
  }

  toString() {
    return `${this.value.toString()}`;
  }
}
