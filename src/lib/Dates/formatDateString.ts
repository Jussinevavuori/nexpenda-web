import { format } from "date-fns";

export function formatDateString(date: Date) {
  return date.getFullYear() === currentYear
    ? format(date, "d.M.")
    : format(date, "d.M.yyyy");
}

const currentYear = new Date().getFullYear();
