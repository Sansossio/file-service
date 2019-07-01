import { BadRequestException, Injectable } from '@nestjs/common';
import { unlink, writeFile } from 'fs';
import { join } from 'path';
import * as fillService from 'pdf-fill-form';
import * as sha1 from 'sha1';
import { promisify } from 'util';
import { FillPdfRequestDto } from './fill-pdf.dto';
import { PdfService } from '../pdf/pdf.service';

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
    const fileName = `${sha1(body.file)}.pdf`;
    await promisify(writeFile)(fileName, pdf);
    const data = body.data.reduce((prev, curr) => {
      prev[curr.key] = curr.value;
      return prev;
    }, {});
    try {
      return (await fillService.write(fileName, data, { save: 'pdf' })) as Buffer;
    } finally {
      await promisify(unlink)(fileName);
    }
  }
}
