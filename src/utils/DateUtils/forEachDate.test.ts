import { isSameDay } from "date-fns";
import { DateUtils } from "./DateUtils";

describe("forEachDate function", () => {
  it("Loops correctly through dates", () => {
    const dates = [
      new Date("2021-01-01"),
      new Date("2021-01-02"),
      new Date("2021-01-03"),
      new Date("2021-01-04"),
      new Date("2021-01-05"),
    ];

    DateUtils.forEachDate(dates[0], dates[dates.length - 1], (date, i) => {
      expect(isSameDay(date, dates[i])).toBeTruthy();
    });
  });
  it("Loops correctly through dates in reverse order", () => {
    const dates = [
      new Date("2021-01-05"),
      new Date("2021-01-04"),
      new Date("2021-01-03"),
      new Date("2021-01-02"),
      new Date("2021-01-01"),
    ];

    DateUtils.forEachDate(dates[0], dates[dates.length - 1], (date, i) => {
      expect(isSameDay(date, dates[i])).toBeTruthy();
    });
  });

  it("Only runs once when dates are on same day", () => {
    let runs = 0;
    DateUtils.forEachDate(
      new Date("2021-01-01T12:00:00"),
      new Date("2021-01-01T15:00:00"),
      () => {
        runs++;
      }
    );
    expect(runs).toBe(1);
  });

  it("Works across month borders", () => {
    let runs = 0;

    const dates = [
      new Date("2021-01-30"),
      new Date("2021-01-31"),
      new Date("2021-02-01"),
      new Date("2021-02-02"),
    ];

    DateUtils.forEachDate(dates[0], dates[dates.length - 1], (date, i) => {
      expect(isSameDay(date, dates[i])).toBeTruthy();
      runs++;
    });

    expect(runs).toBe(dates.length);
  });

  it("Works across year borders", () => {
    let runs = 0;

    const dates = [
      new Date("2020-12-30"),
      new Date("2020-12-31"),
      new Date("2021-01-01"),
      new Date("2021-01-02"),
    ];

    DateUtils.forEachDate(dates[0], dates[dates.length - 1], (date, i) => {
      expect(isSameDay(date, dates[i])).toBeTruthy();
      runs++;
    });

    expect(runs).toBe(dates.length);
  });
});
