import dayjs from "dayjs";

export function setExpireDate() {
  const expireDate = dayjs().add(1, "day").toDate();
  expireDate.setHours(0);
  expireDate.setMinutes(59);
  expireDate.setSeconds(59);
  return expireDate;
}
