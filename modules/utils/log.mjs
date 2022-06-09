import fs from "fs";

function civilianDateTime() {
  const nowDate = new Date().toISOString();
  const dateTime = nowDate.split("T");
  const date = dateTime[0];
  const time = dateTime[1].split(".")[0];

  return `${date} ${time}`;
}

function formatMessage(message, type) {
  return `${civilianDateTime()} - [${type}]: ${message}\n`;
}

function logWrite(message, type = "****") {
  const logFilename = ".\\run-tasks.log.txt";

  let stream = fs.createWriteStream(logFilename, { flags: "a" });

  stream.on("error", (err) => {
    console.log(`${err.name} log file '${file}'. ${err.message}`);
  });

  stream.write(formatMessage(message, type));
  stream.end();
}

export default logWrite;
