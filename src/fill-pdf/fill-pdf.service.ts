import { BadRequestException, Injectable } from '@nestjs/common';
import { unlink, writeFile } from 'fs';
import { join } from 'path';
import * as fillService from 'pdf-fill-form';
import * as sha1 from 'sha1';
import { promisify } from 'util';

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
    const filePath = join(__dirname, fileName);
    await promisify(writeFile)(filePath, file.buffer);
    try {
      return await fillService.read(filePath);
    } finally {
      await promisify(unlink)(filePath);
    }
  }
}
