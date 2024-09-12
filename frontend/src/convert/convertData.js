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

export function convertNumberFee(number) {
  if (!number) return 0;
  return numeral(number).format("0,0.0000");
}

export function calculateTimestamp(number) {
  const timestamp = number * 1000; // Convert to milliseconds
  const timestampDate = new Date(timestamp);
  const currentDate = new Date();

  const timeDiff = currentDate - timestampDate;

  // Calculate time differences
  const secondsDiff = Math.floor(timeDiff / 1000);
  const minutesDiff = Math.floor(secondsDiff / 60);
  const hoursDiff = Math.floor(minutesDiff / 60);
  const daysDiff = Math.floor(hoursDiff / 24);

  let timeAgo;

  if (daysDiff > 0) {
    timeAgo = `${daysDiff} days ago`;
  } else if (hoursDiff > 0) {
    timeAgo = `${hoursDiff} hrs ago`;
  } else if (minutesDiff > 0) {
    timeAgo = `${minutesDiff} mins ago`;
  } else {
    timeAgo = `${secondsDiff} secs ago`;
  }

  return timeAgo;
}
export function shortenAddress(address) {
  return `${address.slice(0, 10)}...${address.slice(-10)}`;
}
