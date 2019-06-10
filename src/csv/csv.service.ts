import { Injectable } from '@nestjs/common';
import * as jsonCsv from 'json2csv';
import * as csvJson from 'csvtojson';

@Injectable()
export class CsvService {
  async jsonToCsv(json: any): Promise<string> {
    return await jsonCsv.parseAsync(json);
  }

  csvToJson(data: string) {
    return csvJson().fromString(data);
  }
}
