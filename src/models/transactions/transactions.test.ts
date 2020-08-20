import { Transaction } from "./transactions.class";

describe("transaction class", () => {
  test("creates transaction succesfully from constructable", () => {
    const transaction = new Transaction({
      integerAmount: 0,
      id: "0",
    });
    expect(transaction.id).toBe("0");
    expect(transaction.integerAmount).toBe(0);
  });

  test("automatically generates ID", () => {
    const transaction = new Transaction({ integerAmount: 0 });
    expect(transaction.id).toBeDefined();
    expect(transaction.id).toBeTruthy();
    expect(typeof transaction.id).toEqual("string");
  });

  test("calculates transaction properties correctly with 0 integer amount", () => {
    const transaction = new Transaction({ integerAmount: 0 });
    expect(transaction.amount).toBe(0);
    expect(transaction.cents).toBe(0);
    expect(transaction.euros).toBe(0);
    expect(transaction.formatCents).toBe("00");
    expect(transaction.formatEuros).toBe("0");
    expect(transaction.formatFull).toBe("±0.00");
    expect(transaction.sign).toBe(0);
    expect(transaction.formatSign).toBe("±");
    expect(transaction.integerAmount).toBe(0);
    expect(transaction.unsignedAmount).toBe(0);
    expect(transaction.unsignedIntegerAmount).toBe(0);
  });

  test("calculates transaction properties correctly with positive integer amount", () => {
    const transaction1 = new Transaction({ integerAmount: 50 });
    const transaction2 = new Transaction({ integerAmount: 905 });
    const transaction3 = new Transaction({ integerAmount: 12052 });
    expect(transaction1.amount).toBe(0.5);
    expect(transaction2.amount).toBe(9.05);
    expect(transaction3.amount).toBe(120.52);
    expect(transaction1.cents).toBe(50);
    expect(transaction2.cents).toBe(5);
    expect(transaction3.cents).toBe(52);
    expect(transaction1.euros).toBe(0);
    expect(transaction2.euros).toBe(9);
    expect(transaction3.euros).toBe(120);
    expect(transaction1.formatCents).toBe("50");
    expect(transaction2.formatCents).toBe("05");
    expect(transaction3.formatCents).toBe("52");
    expect(transaction1.formatEuros).toBe("0");
    expect(transaction2.formatEuros).toBe("9");
    expect(transaction3.formatEuros).toBe("120");
    expect(transaction1.formatFull).toBe("+0.50");
    expect(transaction2.formatFull).toBe("+9.05");
    expect(transaction3.formatFull).toBe("+120.52");
    expect(transaction1.sign).toBe(1);
    expect(transaction2.sign).toBe(1);
    expect(transaction3.sign).toBe(1);
    expect(transaction1.formatSign).toBe("+");
    expect(transaction2.formatSign).toBe("+");
    expect(transaction3.formatSign).toBe("+");
    expect(transaction1.integerAmount).toBe(50);
    expect(transaction2.integerAmount).toBe(905);
    expect(transaction3.integerAmount).toBe(12052);
    expect(transaction1.unsignedAmount).toBe(0.5);
    expect(transaction2.unsignedAmount).toBe(9.05);
    expect(transaction3.unsignedAmount).toBe(120.52);
    expect(transaction1.unsignedIntegerAmount).toBe(50);
    expect(transaction2.unsignedIntegerAmount).toBe(905);
    expect(transaction3.unsignedIntegerAmount).toBe(12052);
  });

  test("calculates transaction properties correctly with negative integer amount", () => {
    const transaction1 = new Transaction({ integerAmount: -50 });
    const transaction2 = new Transaction({ integerAmount: -905 });
    const transaction3 = new Transaction({ integerAmount: -12052 });
    expect(transaction1.amount).toBe(-0.5);
    expect(transaction2.amount).toBe(-9.05);
    expect(transaction3.amount).toBe(-120.52);
    expect(transaction1.cents).toBe(-50);
    expect(transaction2.cents).toBe(-5);
    expect(transaction3.cents).toBe(-52);
    expect(transaction1.euros).toBe(-0);
    expect(transaction2.euros).toBe(-9);
    expect(transaction3.euros).toBe(-120);
    expect(transaction1.formatCents).toBe("50");
    expect(transaction2.formatCents).toBe("05");
    expect(transaction3.formatCents).toBe("52");
    expect(transaction1.formatEuros).toBe("0");
    expect(transaction2.formatEuros).toBe("9");
    expect(transaction3.formatEuros).toBe("120");
    expect(transaction1.formatFull).toBe("-0.50");
    expect(transaction2.formatFull).toBe("-9.05");
    expect(transaction3.formatFull).toBe("-120.52");
    expect(transaction1.sign).toBe(-1);
    expect(transaction2.sign).toBe(-1);
    expect(transaction3.sign).toBe(-1);
    expect(transaction1.formatSign).toBe("-");
    expect(transaction2.formatSign).toBe("-");
    expect(transaction3.formatSign).toBe("-");
    expect(transaction1.integerAmount).toBe(-50);
    expect(transaction2.integerAmount).toBe(-905);
    expect(transaction3.integerAmount).toBe(-12052);
    expect(transaction1.unsignedAmount).toBe(0.5);
    expect(transaction2.unsignedAmount).toBe(9.05);
    expect(transaction3.unsignedAmount).toBe(120.52);
    expect(transaction1.unsignedIntegerAmount).toBe(50);
    expect(transaction2.unsignedIntegerAmount).toBe(905);
    expect(transaction3.unsignedIntegerAmount).toBe(12052);
  });
});
