import fs from "fs";
import * as constants from "./constants.mjs";

export const TYPE_MESSAGE_SYST = "Task";
export const TYPE_MESSAGE_INFO = "Info";
export const TYPE_MESSAGE_ERROR = "Error";

function prependZero(number) {
  return number < 10 ? "0" + number : number;
}

function getDateTimeNow(splitDate = "-", splitTime = ":") {
  let date, time;

  const nowDate = new Date();

  let year = String(nowDate.getFullYear());

  let month = String(nowDate.getMonth() + 1);
  let day = String(nowDate.getDate());
  let hours = String(nowDate.getHours());
  let minutes = String(nowDate.getMinutes());
  let seconds = String(nowDate.getSeconds());
  let milliseconds = String(nowDate.getMilliseconds());

  month = prependZero(month);
  day = prependZero(day);
  hours = prependZero(hours);
  minutes = prependZero(minutes);
  seconds = prependZero(seconds);
  milliseconds = prependZero(milliseconds);

  date = `${year}${splitDate}${month}${splitDate}${day}`;
  time = `${hours}${splitTime}${minutes}${splitTime}${seconds}`;

  return {
    date,
    time,
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    milliseconds,
  };
}

function formatMessage(message, type) {
  const { date, time } = getDateTimeNow();
  return `${date} ${time} - [${type}]: ${message}\n`;
}

export function writeMessage(message, type) {
  const dateLogFile = getDateTimeNow("_").date;
  const logFilename = `${constants.pathLogFilename}\\run-tasks-${dateLogFile}.log.txt`;
  fs.appendFileSync(logFilename, formatMessage(message, type), { flags: "a" });
}
