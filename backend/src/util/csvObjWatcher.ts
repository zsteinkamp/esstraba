import fs from "fs"
import * as CsvParse from "csv-parse"
import path from "path"

type CsvRecord = Record<string, string>
type CsvRecords = CsvRecord[]

export class CsvObjWatcher {
  fullDataPath: string
  dataStat: fs.Stats
  _records: CsvRecords = []
  _byId: Record<string, number> = {}
  _inProgressFlag = false
  _checkPromise: Promise<void>

  constructor(dataPath: string) {
    this.fullDataPath = path.resolve(`data/${dataPath}.csv`)
    this.dataStat = fs.statSync(this.fullDataPath)
    this._checkPromise = this.checkFile()
    setInterval(this.checkFile.bind(this), 1000)
  }

  async checkFile(): Promise<void> {
    if (this._inProgressFlag) {
      return
    }
    this._inProgressFlag = true

    const currStat = fs.statSync(this.fullDataPath)
    const csm = currStat.mtime.getTime()
    const dsm = this.dataStat.mtime.getTime()
    const statDiff = csm !== dsm
    /*console.info("CHECK FILE", {
      len: this._records.length,
      csm,
      dsm,
      statDiff,
    })*/
    if (this._records.length === 0 || statDiff) {
      console.info("PROCESS FILE", { path: this.fullDataPath })
      await this.processFile()
      this.dataStat = currStat
    }
    this._inProgressFlag = false
  }

  records(): CsvRecords {
    return this._records
  }

  byId(id: string): CsvRecord {
    return this._records[this._byId[id]]
  }

  async processFile(): Promise<this> {
    if (!this.dataStat) {
      return this
    }

    const headerParser = fs
      .createReadStream(this.fullDataPath)
      .pipe(CsvParse.parse({ to_line: 1 }))

    let headers: string[] = []
    for await (const record of headerParser) {
      headers = record
      // should only run once
    }

    // unf**k the header names for untranslated warnings
    headers.forEach((h: string, i: number) => {
      headers[i] = h.replaceAll(/<[^>]+>/g, "")
    })

    //console.log('HEADERS', headers)

    this._records = []

    // now read the rest of the file
    //console.log('FDP', { match: this.fullDataPath.match(/\.gz$/), fdp: this.fullDataPath })
    const parser = fs.createReadStream(this.fullDataPath).pipe(
      CsvParse.parse({
        // CSV options
        columns: headers, // pass our fixed-up headers
        from_line: 2, // skip the header row
      }),
    )
    for await (const record of parser) {
      // Build an index of object ID (always the first column) to position in the array.
      this._byId[record[headers[0]]] = this._records.length
      this._records.push(record)
    }
    return this
  }
}
