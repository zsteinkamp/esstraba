import fs from 'fs'
import { parse } from 'csv-parse';
import path from 'path';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

type CsvRecords = Record<string, any>[]

export class CsvObjWatcher {
  fullDataPath: string
  dataStat: fs.Stats
  _records: CsvRecords = []

  constructor(dataPath: string) {
    this.fullDataPath = path.resolve(`data/${dataPath}.csv`)
    this.dataStat = fs.statSync(this.fullDataPath)
    setInterval(this.checkFile.bind(this), 4000)
  }

  checkFile(): void {
    const currStat = fs.statSync(this.fullDataPath)
    const csm = currStat.mtime.getTime()
    const dsm = this.dataStat.mtime.getTime()
    const statDiff = csm !== dsm
    console.info('CHECK FILE', { len: this._records.length, csm, dsm, statDiff })
    if (this._records.length === 0 || statDiff) {
      console.info('PROCESS FILE')
      this.processFile()
      this.dataStat = currStat
    }
  }

  records(): CsvRecords {
    return this._records
  }

  async processFile(): Promise<this> {
    if (!this.dataStat) {
      return this
    }
    const headerParser = fs.createReadStream(this.fullDataPath).pipe(parse({ to_line: 1 }))
    let headers = []
    for await (const record of headerParser) {
      headers = record;
      // should only run once
    }

    // unf**k the header names for untranslated warnings
    headers.forEach((h: string, i: number) => {
      headers[i] = h.replaceAll(/<[^>]+>/g, '')
    })

    this._records = []

    // now read the rest of the file
    const parser = fs
      .createReadStream(this.fullDataPath)
      .pipe(parse({
        // CSV options
        columns: headers, // pass our fixed-up headers
        from_line: 2, // skip the header row
      }))
    for await (const record of parser) {
      // Work with each record
      this._records.push(record);
    }
    return this
  }

}
