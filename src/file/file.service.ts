import { Injectable, NotFoundException } from '@nestjs/common';
import * as rp from 'request-promise';

@Injectable()
export class FileService {
  async get(uri: string, repeat: boolean = true): Promise<Buffer> {
    try {
      const options: rp.OptionsWithUri = {
        uri,
        encoding: null,
      };
      return (await (rp(options) as any)) as Buffer;
    } catch (e) {
      if (repeat) {
        return await this.get(encodeURI(uri), false);
      }
      throw new NotFoundException(`Pdf not found: ${uri}`);
    }
  }
}
