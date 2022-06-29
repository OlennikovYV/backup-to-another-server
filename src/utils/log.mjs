import fs from "fs";

function prependZero(time) {
  return time < 10 ? "0" + time : time;
}

function getDateTime(splitDate = "-", splitTime = ":") {
  let date, time;

  const nowDate = new Date();

  let year = String(nowDate.getFullYear());

  let month = String(nowDate.getMonth());
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
  const { date, time } = getDateTime();
  return `${date} ${time} - [${type}]: ${message}\n`;
}

function logWrite(message, type) {
  return new Promise((resolve, reject) => {
    const logFilename = ".\\run-tasks.log.txt";

    let stream = fs.createWriteStream(logFilename, { flags: "a" });

    stream.on("error", (err) => {
      console.log(`${err.name} log file '${file}'. ${err.message}`);
    });

    stream.write(formatMessage(message, type));
    stream.on("close", () => resolve(srcFile));
  });
}

export default logWrite;
