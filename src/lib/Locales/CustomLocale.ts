import DateFnsUtils from "@date-io/date-fns";
import locale from "date-fns/locale/en-GB";
import * as datefns from "date-fns";

export class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date: Date) {
    return datefns.format(date, "d. MMM, yyyy", { locale, weekStartsOn: 1 });
  }

  static get Locale() {
    return {
      ...locale,
      options: {
        ...locale.options,
        weekStartsOn: 1,
      },
    };
  }
}
