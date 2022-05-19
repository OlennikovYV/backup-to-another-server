import fs from 'fs'

class Log {
    constructor(file) {
        this._stream = fs.createWriteStream(file, { flags: 'a' });
        this._stream.on('error', err => {
            console.log(`${err.name} log file '${file}'. ${err.message}`);
        })
    }

    getDate() {
        const date = new Date().toISOString().split('T');
        return date[0] + ' ' + date[1].split('.')[0];
    }

    logs(text, type = 'Info') {
        this._stream.write(`${this.getDate()} - [${type}]: ${text}\n`);
    }

    closeStream() { this._stream.end() }
}

let ll = new Log('');
ll.logs('qqqq', 'aaa');
ll.closeStream();
// export { Log };