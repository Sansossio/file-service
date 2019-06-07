import { Controller, Get, HttpCode, Header, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiUseTags, ApiOkResponse } from '@nestjs/swagger';
import { FileService } from './file.service';
import { Readable } from 'stream';
import { Response } from 'express-serve-static-core';
import { GetPdf } from '../pdf/dto/pdf.dto';
import { ResponseFile } from './file.validations';

const staticHeaders = ['Content-Type', 'application/pdf'];

@Controller('file')
export class FileController {
  constructor(private readonly service: FileService) {}

  @Get('remote')
  @ApiOperation({
    title: 'Get remote file',
    description: 'See external file',
  })
  @HttpCode(200)
  @Header(staticHeaders[0], staticHeaders[1])
  @ApiUseTags('Get file')
  async get(@Query() { url }: GetPdf, @Res() res?: Response) {
    const file = await this.service.get(url);
    if (res) {
      const stream = new Readable();
      stream.push(file);
      stream.push(null);
      stream.pipe(res);
      return;
    }
    return file;
  }

  @Get('remote/base64')
  @ApiOperation({
    title: 'Get remote file',
    description: 'See external file',
  })
  @HttpCode(200)
  @ApiOkResponse({ type: ResponseFile })
  @ApiUseTags('Get file')
  async getBase64(@Query() query: GetPdf): Promise<ResponseFile> {
    const file = await this.get(query);
    return {
      file: file.toString('base64'),
    };
  }
}
