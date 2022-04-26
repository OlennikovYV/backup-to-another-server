import fs from 'fs'
import path from 'path'
import zlib from 'zlib'

class workFS {
    constructor(srcPath, dstPath, storageTime = 10) {
        this._src = srcPath;
        this._dst = dstPath;
        this._storageTime = storageTime;
    }

    get src() { return this._src }
    get dst() { return this._dst }
    get storageTime() { return this._storageTime }

    getFullName(dir, fileName) { return path.join(dir, fileName) }
    getExtFile(fileName) { return path.extname(fileName) }
    getFilesList(path) { return fs.readdirSync(path) }
    fileExists(fileName) { return fs.existsSync(fileName) }
    changeExt(fileName, fromExt, toExt) {
        const regexp = new RegExp(fromExt + '$');
        return fileName.replace(regexp, toExt);
    }
    timeCreateFile(fileName) {
        let stat;
        if (this.fileExists(fileName))
            stat = fs.statSync(fileName, err => {
                if (err) throw err;
            });
        return stat ? stat.ctime : 0;
    }
    copyFiles(srcFile, dstFile) {
        return new Promise((resolve, reject) => {
            const read = fs.createReadStream(srcFile);
            read.on('error', err => reject(err));
            const write = fs.createWriteStream(dstFile);
            write.on('error', err => reject(err));
            write.on('close', () => resolve(dstFile));
            read.pipe(write);
        });
    }
    deleteFile(fileName) {
        if (this.fileExists(fileName))
            fs.unlink(fileName, (err) => {
                if (err) throw err;
                console.info(`${fileName} was deleted`);
            });
    }
    zipFile(file, archiv) {
        const thisCB = this;
        let readableStream = fs.createReadStream(file, 'utf8');
        readableStream.on("error", err => {
            throw err
        });
        let writeableStream = fs.createWriteStream(archiv);
        writeableStream.on("error", err => {
            throw err
        });

        readableStream.on("close", function(ex) {
            thisCB.deleteFile(file);
        });

        let gzip = zlib.createGzip();
        readableStream.pipe(gzip).pipe(writeableStream);
    }
    async backUpCopy() {
        // console.group('Task: backup');
        console.log('Backup');

        const srcFileList = this.getFilesList(this.src);

        const filterFileList = srcFileList.filter(el => {
            const srcFullName = this.getFullName(this.src, el);
            const fileTime = this.timeCreateFile(srcFullName);

            if (!fileTime) return false;

            const age = new Date() - new Date(fileTime);

            return (new Date(age).getDate() <= this.storageTime) &&
                (this.getExtFile(el) === '.bak') &&
                (!this.fileExists(this.getFullName(this.dst, el)));
        });

        if (filterFileList.length > 0) {
            for (let file of filterFileList) {
                const srcFullName = this.getFullName(this.src, file);
                const dstFullName = this.getFullName(this.dst, file);
                await this.copyFiles(srcFullName, dstFullName)
                    .then(res => console.log(`Files ${res} copied.`));
            };
        } else
            console.log('No files to copy.');

        console.log('Backup finish.')
            // console.groupEnd('Task: backup');
    }
    garbageCollector() {
        // console.group('Task: garbage');
        console.log('Garbage');
        const dstFileList = this.getFilesList(this.dst);

        const filterFileList = dstFileList.filter(el => {
            const fullName = this.getFullName(this.dst, el);
            const fileTime = this.timeCreateFile(fullName);

            if (!fileTime) return false;

            const age = new Date() - new Date(fileTime);
            return (new Date(age).getDate() > this.storageTime) &&
                (
                    (this.getExtFile(fullName) === '.bak') ||
                    (this.getExtFile(fullName) === '.gz')
                );
        });
        filterFileList.forEach(file => {
            const fullName = this.getFullName(this.dst, file);
            // if (this.fileExists(fullName))
            // this.deleteFile(fullName);
        });
        // console.groupEnd('Task: garbage');
    }
    zippedFiles() {
        console.group('Task: zipped');
        const dstFileList = this.getFilesList(this.dst);

        const filterFileList = dstFileList.filter(file => {
            const fullName = this.getFullName(this.dst, file);
            const fileTime = this.timeCreateFile(fullName);

            if (!fileTime) return false;

            const age = new Date() - new Date(fileTime);
            return (new Date(age).getDate() <= this.storageTime) &&
                (this.getExtFile(fullName) === '.bak');
        });
        filterFileList.forEach(file => {
            const nameArchiv = this.changeExt(file, '.bak', '.gz');
            const srcFullName = this.getFullName(this.dst, file);
            const dstFullName = this.getFullName(this.dst, nameArchiv);
            // this.zipFile(srcFullName, dstFullName);
        });
        console.groupEnd('Task: zipped');
    }
}

async function runTasks(srcDir, dstDir, storageTime = 30, executeTasks = {}) {
    const work = new workFS(
        srcDir,
        dstDir,
        storageTime
    );

    if (!work.fileExists(srcDir) && !work.fileExists(dstDir)) return;

    // TODO redo in sync
    if (executeTasks['backup'])
        await work.backUpCopy();
    if (executeTasks['garbage'])
        work.garbageCollector();
    if (executeTasks['zipped'])
        work.zippedFiles();
}

export { runTasks };