import dayjs from "dayjs";
import jalaliday from "jalaliday";

export function formatDate(
  date?: string,
  format: string = "YYYY/MM/DD",
): string {
  dayjs.extend(jalaliday);
  if (!date) return "";
  return dayjs(date).calendar("jalali").locale("fa").format(format);
}
