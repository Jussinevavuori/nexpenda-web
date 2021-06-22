import { Calculation } from "../Calculation";

describe("Calculation", () => {
  const FN = Calculation.Function;
  const N = Calculation.Number;

  function debug(c: Calculation) {
    console.log(
      [
        `Input: ${c.formatInput()}`,
        `Output: ${c.value}`,
        `String: ${c.str}`,
        `Expressions: ${c.expressionList.toString()}`,
      ].join("\n")
    );
  }

  it("Parses numbers correctly", () => {
    let c = new Calculation("");
    c = c.input(N(1));

    debug(c);

    expect(c.value).toBe(1);

    c = c.input(N(2));
    expect(c.value).toBe(12);
  });

  it("Can clear the screen", () => {
    let c = new Calculation("");
    c = c.input(N(1));
    c = c.input(N(2));
    c = c.input(N(3));
    c = c.input(N(4));
    c = c.input(FN.CLEAR);

    expect(c.value).toBe(0);
    expect(c.formatInput()).toBe("");
  });

  it("Can remove the latest character", () => {
    let c = new Calculation("");
    c = c.input(N(1));
    c = c.input(N(2));
    c = c.input(N(3));
    c = c.input(N(4));

    expect(c.value).toBe(1234);

    c = c.input(FN.BACK);
    expect(c.value).toBe(123);

    c = c.input(FN.BACK);
    expect(c.value).toBe(12);

    c = c.input(FN.BACK);
    expect(c.value).toBe(1);

    c = c.input(FN.BACK);
    expect(c.value).toBe(0);
  });

  it("Performs simple operators correctly", () => {
    let c = new Calculation("");

    c = c.input(N(1));
    c = c.input(FN.ADD);
    c = c.input(N(2));
    expect(c.value).toBe(3);

    c = c.input(FN.CLEAR);
    c = c.input(N(4));
    c = c.input(N(2));
    c = c.input(FN.SUBTRACT);
    c = c.input(N(1));
    c = c.input(N(2));
    expect(c.value).toBe(30);

    c = c.input(FN.CLEAR);
    c = c.input(N(3));
    c = c.input(FN.MULTIPLY);
    c = c.input(N(1));
    c = c.input(N(1));
    expect(c.value).toBe(33);

    c = c.input(FN.CLEAR);
    c = c.input(N(1));
    c = c.input(N(0));
    c = c.input(N(0));
    c = c.input(FN.DIVIDE);
    c = c.input(N(2));
    c = c.input(N(0));
    expect(c.value).toBe(5);
  });

  // it("Handles commas correctly", () => {});
  // it("Can perform multiple operators in order", () => {});
  // it("Knows the order of operations", () => {});
  // it("Inputs parenthesis correctly", () => {});
  // it("Can handle parenthesis expressions", () => {});
  // it("Handles missing parenthesis", () => {});
  // it("Handles implicit multiplication", () => {});
});
