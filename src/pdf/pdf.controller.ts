import { Controller, Post, Body, HttpCode, Header, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { ApiUseTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { PdfDto, PdfMergeDto, PdfBase64ResponseDto } from './dto/pdf.dto';
import { Readable } from 'stream';
import { Response } from 'express';

@Controller('pdf')
@ApiUseTags('Pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post()
  @ApiOperation({
    title: 'Convert html to pdf',
  })
  @Header('Content-Type', 'application/pdf')
  async htmlToPdf(@Body() body: PdfDto, @Res() res?: Response) {
    const pdfBuffer: Buffer = await this.pdfService.generate(body);
    if (res) {
      const stream = new Readable();
      stream.push(pdfBuffer);
      stream.push(null);
      stream.pipe(res);
      return;
    }
    return pdfBuffer;
  }

  @Post('base64')
  @ApiOkResponse({ type: PdfBase64ResponseDto })
  @ApiOperation({
    title: 'Convert html to pdf and return base64',
  })
  async pdfBase64(@Body() body: PdfDto): Promise<PdfBase64ResponseDto> {
    const pdf: Buffer = await this.htmlToPdf(body);
    return {
      pdf: pdf.toString('base64'),
    };
  }

  @Post('merge')
  @ApiOperation({
    title: 'Merge pdf',
    description: 'Merge two or more pdf, pdf body must a be base64',
  })
  @HttpCode(200)
  @Header('Content-Type', 'application/pdf')
  async mergePdf(@Body() body: PdfMergeDto, @Res() res?: Response) {
    const pdfBuffer: Buffer = await this.pdfService.merge(body);
    if (res) {
      const stream = new Readable();
      stream.push(pdfBuffer);
      stream.push(null);
      stream.pipe(res);
      return;
    }
    return pdfBuffer;
  }

  @Post('merge/base64')
  @ApiOkResponse({ type: PdfBase64ResponseDto })
  @ApiOperation({
    title: 'Merge pdf base64',
    description: 'Merge two or more pdf, pdf body must a be base64',
  })
  @HttpCode(200)
  async mergePdfBase64(@Body() body: PdfMergeDto) {
    const pdf: Buffer = await this.mergePdf(body);
    return {
      pdf: pdf.toString('base64'),
    };
  }
}
