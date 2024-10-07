import dayjs from "dayjs";

const millisPerDay = 86400000; // 24 * 60 * 60 * 1000

export function setExpireDate() {
  const expireDate = dayjs().add(1, "day").toDate();
  expireDate.setHours(0);
  expireDate.setMinutes(59);
  expireDate.setSeconds(59);
  return expireDate;
}

export function isDifferenceGreaterSpecifiedDay(dateISO: string, days = 7) {
  const difference = Math.abs(
    new Date().getTime() - new Date(dateISO).getTime()
  );
  return difference >= millisPerDay * days;
}
