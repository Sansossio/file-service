import { Injectable } from '@nestjs/common';
import * as converter from 'json-2-csv';

@Injectable()
export class CsvService {
  async jsonToCsv(json: any): Promise<string> {
    return await converter.json2csvAsync(json);
  }

  async csvToJson(data: string) {
    return await converter.csv2jsonAsync(data);
  }
}
