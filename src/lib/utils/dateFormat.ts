import { format } from "date-fns";

const dateFormat = (
  date: Date | string | undefined | null,
  pattern: string = "dd MMM, yyyy",
): string => {
  if (!date) {
    return "";
  }
  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) {
    return "";
  }
  return format(dateObj, pattern);
};

export default dateFormat;
