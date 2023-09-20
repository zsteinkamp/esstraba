import fs from 'fs'
import { parse } from 'csv-parse';

import { dirname } from 'path';
import { fileURLToPath } from 'url';


export class CsvObjWatcher {
  dataPath: string
  dataStat: fs.Stats

  constructor(dataPath: string) {
    this.dataPath = dataPath
    this.dataStat = fs.statSync(`data/${this.dataPath}`)
  }

  async processFile(): Promise<any[]> {
    const records = [];
    const parser = fs
      .createReadStream(`data/${this.dataPath}`)
      .pipe(parse({
        // CSV options if any
      }));
    for await (const record of parser) {
      // Work with each record
      records.push(record);
    }
    return records;
  }

  output(): string {
    this.processFile()
    return this.dataPath
  }

}
