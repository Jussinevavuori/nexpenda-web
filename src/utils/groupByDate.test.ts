import * as datefns from "date-fns";
import { groupByDate } from "./groupByDate";

const items = [
  {
    date: new Date("2020-01-10"),
    value: "1",
  },
  {
    date: new Date("2020-01-11"),
    value: "2",
  },
  {
    date: new Date("2020-01-11"),
    value: "3",
  },
  {
    date: new Date("2020-01-12"),
    value: "4",
  },
  {
    date: new Date("1999-01-01"),
    value: "5",
  },
];

describe("group by date", () => {
  it("should correctly group items by dates", () => {
    const result = groupByDate(items, (_) => _.date);
    expect(result).toHaveLength(4);
    const target = new Date("2020-01-11");
    const group = result.find((_) => datefns.isSameDay(_.date, target));
    expect(group).toBeDefined();
    expect(group!.items).toHaveLength(2);
    const groupValue2 = group!.items.find((_) => _.value === "2");
    const groupValue3 = group!.items.find((_) => _.value === "3");
    expect(groupValue2).toBeDefined();
    expect(groupValue3).toBeDefined();
  });

  it("should return groups in sorted order when required", () => {
    const result = groupByDate(items, (_) => _.date);
    expect(datefns.isBefore(result[0].date, result[1].date)).toBeTruthy();
    expect(datefns.isBefore(result[1].date, result[2].date)).toBeTruthy();
    expect(datefns.isBefore(result[2].date, result[3].date)).toBeTruthy();
  });
});
