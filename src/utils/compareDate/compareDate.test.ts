import { compareDate } from "./compareDate";

const dates = [
  new Date("2020-01-10"),
  new Date("2020-01-11"),
  new Date("2020-01-12"),
];

const times = [
  [
    new Date("2020-01-10T10:00:00"),
    new Date("2020-01-10T11:00:00"),
    new Date("2020-01-10T12:00:00"),
  ],
  [
    new Date("2020-01-11T10:00:00"),
    new Date("2020-01-11T11:00:00"),
    new Date("2020-01-11T12:00:00"),
  ],
  [
    new Date("2020-01-12T10:00:00"),
    new Date("2020-01-12T11:00:00"),
    new Date("2020-01-12T12:00:00"),
  ],
];

describe("compareDate function", () => {
  it("works on < when time is not considered", () => {
    expect(compareDate(dates[0], "<", dates[0])).toBe(false);
    expect(compareDate(dates[0], "<", dates[1])).toBe(true);
    expect(compareDate(dates[0], "<", dates[2])).toBe(true);

    expect(compareDate(dates[1], "<", dates[0])).toBe(false);
    expect(compareDate(dates[1], "<", dates[1])).toBe(false);
    expect(compareDate(dates[1], "<", dates[2])).toBe(true);

    expect(compareDate(dates[2], "<", dates[0])).toBe(false);
    expect(compareDate(dates[2], "<", dates[1])).toBe(false);
    expect(compareDate(dates[2], "<", dates[2])).toBe(false);
  });

  it("works on <= when time is not considered", () => {
    expect(compareDate(dates[0], "<=", dates[0])).toBe(true);
    expect(compareDate(dates[0], "<=", dates[1])).toBe(true);
    expect(compareDate(dates[0], "<=", dates[2])).toBe(true);

    expect(compareDate(dates[1], "<=", dates[0])).toBe(false);
    expect(compareDate(dates[1], "<=", dates[1])).toBe(true);
    expect(compareDate(dates[1], "<=", dates[2])).toBe(true);

    expect(compareDate(dates[2], "<=", dates[0])).toBe(false);
    expect(compareDate(dates[2], "<=", dates[1])).toBe(false);
    expect(compareDate(dates[2], "<=", dates[2])).toBe(true);
  });

  it("works on == when time is not considered", () => {
    expect(compareDate(dates[0], "==", dates[0])).toBe(true);
    expect(compareDate(dates[0], "==", dates[1])).toBe(false);
    expect(compareDate(dates[0], "==", dates[2])).toBe(false);

    expect(compareDate(dates[1], "==", dates[0])).toBe(false);
    expect(compareDate(dates[1], "==", dates[1])).toBe(true);
    expect(compareDate(dates[1], "==", dates[2])).toBe(false);

    expect(compareDate(dates[2], "==", dates[0])).toBe(false);
    expect(compareDate(dates[2], "==", dates[1])).toBe(false);
    expect(compareDate(dates[2], "==", dates[2])).toBe(true);
  });

  it("works on >= when time is not considered", () => {
    expect(compareDate(dates[0], ">=", dates[0])).toBe(true);
    expect(compareDate(dates[0], ">=", dates[1])).toBe(false);
    expect(compareDate(dates[0], ">=", dates[2])).toBe(false);

    expect(compareDate(dates[1], ">=", dates[0])).toBe(true);
    expect(compareDate(dates[1], ">=", dates[1])).toBe(true);
    expect(compareDate(dates[1], ">=", dates[2])).toBe(false);

    expect(compareDate(dates[2], ">=", dates[0])).toBe(true);
    expect(compareDate(dates[2], ">=", dates[1])).toBe(true);
    expect(compareDate(dates[2], ">=", dates[2])).toBe(true);
  });

  it("works on > when time is not considered", () => {
    expect(compareDate(dates[0], ">", dates[0])).toBe(false);
    expect(compareDate(dates[0], ">", dates[1])).toBe(false);
    expect(compareDate(dates[0], ">", dates[2])).toBe(false);

    expect(compareDate(dates[1], ">", dates[0])).toBe(true);
    expect(compareDate(dates[1], ">", dates[1])).toBe(false);
    expect(compareDate(dates[1], ">", dates[2])).toBe(false);

    expect(compareDate(dates[2], ">", dates[0])).toBe(true);
    expect(compareDate(dates[2], ">", dates[1])).toBe(true);
    expect(compareDate(dates[2], ">", dates[2])).toBe(false);
  });

  it("neglects time of day", () => {
    expect(compareDate(times[0][0], "<", times[0][0])).toBe(false);
    expect(compareDate(times[0][2], "<", times[1][0])).toBe(true);
    expect(compareDate(times[0][0], "<=", times[0][1])).toBe(true);
    expect(compareDate(times[1][1], "==", times[1][2])).toBe(true);
    expect(compareDate(times[2][1], ">=", times[2][0])).toBe(true);
    expect(compareDate(times[1][0], "<=", times[0][1])).toBe(false);
    expect(compareDate(times[2][1], "==", times[1][2])).toBe(false);
    expect(compareDate(times[0][1], ">=", times[2][0])).toBe(false);
  });
});
