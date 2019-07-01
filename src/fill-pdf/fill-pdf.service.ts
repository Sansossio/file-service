import { BadRequestException, Injectable } from '@nestjs/common';
import { unlink, writeFile } from 'fs';
import * as fillService from 'pdf-fill-form';
import * as sha1 from 'sha1';
import { promisify } from 'util';

import { FillPdfRequestDto } from './fill-pdf.dto';

interface IFile {
  buffer: Buffer;
  mimetype: string;
}

@Injectable()
export class FillPdfService {
  private validations(file: IFile) {
    if (!file) {
      throw new BadRequestException();
    }
    const { mimetype } = file;
    if (mimetype !== 'application/pdf') {
      throw new BadRequestException('File must a be pdf');
    }
  }

  async getKeys(file: IFile) {
    this.validations(file);
    const fileName = `${sha1(file)}.pdf`;
    await promisify(writeFile)(fileName, file.buffer);
    try {
      return await fillService.read(fileName);
    } finally {
      await promisify(unlink)(fileName);
    }
  }

  async writePdf(body: FillPdfRequestDto) {
    const pdf = Buffer.from(body.file, 'base64');
    const data = body.data.reduce((prev, curr) => {
      prev[curr.key] = curr.value;
      return prev;
    }, {});
    // Comprobe keys
    const baseKeys = await this.getKeys({
      buffer: pdf,
      mimetype: 'application/pdf',
    });
    for (const { name, type } of baseKeys) {
      const currValue = data[name];
      if (currValue === undefined) continue;
      if (type === 'checkbox' && typeof currValue !== 'boolean') {
        throw new BadRequestException('Checkout type need a boolean value');
      }
    }
    // Fill Pdf
    const fileName = `${sha1(body.file)}.pdf`;
    await promisify(writeFile)(fileName, pdf);
    try {
      return (await fillService.write(fileName, data, { save: 'pdf' })) as Buffer;
    } finally {
      await promisify(unlink)(fileName);
    }
  }
}
