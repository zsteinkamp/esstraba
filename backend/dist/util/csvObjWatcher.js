"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvObjWatcher = void 0;
const fs_1 = __importDefault(require("fs"));
const CsvParse = __importStar(require("csv-parse"));
const path_1 = __importDefault(require("path"));
class CsvObjWatcher {
    fullDataPath;
    dataStat;
    _records = [];
    _byId = {};
    _inProgressFlag = false;
    _checkPromise;
    constructor(dataPath) {
        this.fullDataPath = path_1.default.resolve(`data/${dataPath}.csv`);
        this.dataStat = fs_1.default.statSync(this.fullDataPath);
        this._checkPromise = this.checkFile();
        setInterval(this.checkFile.bind(this), 1000);
    }
    async checkFile() {
        if (this._inProgressFlag) {
            return;
        }
        this._inProgressFlag = true;
        const currStat = fs_1.default.statSync(this.fullDataPath);
        const csm = currStat.mtime.getTime();
        const dsm = this.dataStat.mtime.getTime();
        const statDiff = csm !== dsm;
        /*console.info("CHECK FILE", {
          len: this._records.length,
          csm,
          dsm,
          statDiff,
        })*/
        if (this._records.length === 0 || statDiff) {
            console.info("PROCESS FILE", { path: this.fullDataPath });
            await this.processFile();
            this.dataStat = currStat;
        }
        this._inProgressFlag = false;
    }
    records() {
        return this._records;
    }
    byId(id) {
        return this._records[this._byId[id]];
    }
    async processFile() {
        if (!this.dataStat) {
            return this;
        }
        const headerParser = fs_1.default
            .createReadStream(this.fullDataPath)
            .pipe(CsvParse.parse({ to_line: 1 }));
        let headers = [];
        for await (const record of headerParser) {
            headers = record;
            // should only run once
        }
        // unf**k the header names for untranslated warnings
        headers.forEach((h, i) => {
            headers[i] = h.replaceAll(/<[^>]+>/g, "");
        });
        //console.log('HEADERS', headers)
        this._records = [];
        // now read the rest of the file
        //console.log('FDP', { match: this.fullDataPath.match(/\.gz$/), fdp: this.fullDataPath })
        const parser = fs_1.default.createReadStream(this.fullDataPath).pipe(CsvParse.parse({
            // CSV options
            columns: headers,
            from_line: 2, // skip the header row
        }));
        for await (const record of parser) {
            // Build an index of object ID (always the first column) to position in the array.
            this._byId[record[headers[0]]] = this._records.length;
            this._records.push(record);
        }
        return this;
    }
}
exports.CsvObjWatcher = CsvObjWatcher;
//# sourceMappingURL=csvObjWatcher.js.map