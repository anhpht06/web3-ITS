import numeral from "numeral";

export function convertDate(time) {
  if (!time) return 0;
  const date = new Date(time);
  const formattedDate = date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  const result = formattedDate.replace("lúc", "").trim();

  return result;
}

export function convertNumber(number) {
  if (!number) return 0;
  return numeral(number).format("0,0.00");
}
