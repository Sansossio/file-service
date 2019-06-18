import { Injectable, NotFoundException } from '@nestjs/common';
import * as rp from 'request-promise';

@Injectable()
export class FileService {
  async get(uri: string): Promise<Buffer> {
    try {
      const options: rp.OptionsWithUri = {
        uri: encodeURI(uri),
        encoding: null,
      };
      return (await (rp(options) as any)) as Buffer;
    } catch (e) {
      throw new NotFoundException(`Pdf not found: ${uri}`);
    }
  }
}
