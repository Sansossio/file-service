import { Controller, Post, Body, HttpCode, Header, Res, Get, Query } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { ApiUseTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { PdfDto, PdfMergeDto, PdfBase64ResponseDto, PdfMergeUrl, GetPdf } from './dto/pdf.dto';
import { Response } from 'express';

const staticHeaders = ['Content-Type', 'application/pdf'];

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post()
  @ApiOperation({
    title: 'Convert html to pdf',
  })
  @Header(staticHeaders[0], staticHeaders[1])
  @ApiUseTags('Html to Pdf')
  async htmlToPdf(@Body() body: PdfDto, @Res() res?: Response) {
    const pdfBuffer: Buffer = await this.pdfService.generate(body);
    if (res) {
      this.pdfService.responsePdf(res, pdfBuffer);
      return;
    }
    return pdfBuffer;
  }

  @Post('base64')
  @ApiOkResponse({ type: PdfBase64ResponseDto })
  @ApiOperation({
    title: 'Convert html to pdf and return base64',
  })
  @ApiUseTags('Html to Pdf')
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
  @Header(staticHeaders[0], staticHeaders[1])
  @ApiUseTags('Merge Pdf')
  async mergePdf(@Body() body: PdfMergeDto, @Res() res?: Response) {
    const pdfBuffer: Buffer = await this.pdfService.merge(body);
    if (res) {
      this.pdfService.responsePdf(res, pdfBuffer);
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
  @ApiUseTags('Merge Pdf')
  async mergePdfBase64(@Body() body: PdfMergeDto) {
    const pdf: Buffer = await this.mergePdf(body);
    return {
      pdf: pdf.toString('base64'),
    };
  }

  @Post('merge/external')
  @ApiOperation({
    title: 'Merge remote pdf',
    description: 'Merge remote pdfs',
  })
  @HttpCode(200)
  @Header(staticHeaders[0], staticHeaders[1])
  @ApiUseTags('Merge Pdf')
  async mergePdfExternal(@Body() body: PdfMergeUrl, @Res() res?: Response) {
    const pdfBuffer = await this.pdfService.mergeRemote(body);
    if (res) {
      this.pdfService.responsePdf(res, pdfBuffer);
      return;
    }
    return pdfBuffer;
  }

  @Post('merge/external/base64')
  @ApiOperation({
    title: 'Merge remote pdf',
    description: 'Merge remote pdfs and response base64',
  })
  @HttpCode(200)
  @ApiOkResponse({ type: PdfBase64ResponseDto })
  @ApiUseTags('Merge Pdf')
  async mergePdfExternalBase64(@Body() body: PdfMergeUrl, @Res() res?: Response) {
    const pdf = await this.mergePdfExternal(body);
    return {
      pdf: pdf.toString('base64'),
    };
  }

  @Get('remote')
  @ApiOperation({
    title: 'Get remote pdf',
    description: 'See external pdf',
  })
  @HttpCode(200)
  @Header(staticHeaders[0], staticHeaders[1])
  @ApiUseTags('Get remote Pdf')
  async get(@Query() { url }: GetPdf, @Res() res?: Response) {
    const pdfBuffer = await this.pdfService.getRemotePdf(url);
    if (res) {
      this.pdfService.responsePdf(res, pdfBuffer);
      return;
    }
    return pdfBuffer;
  }

  @Get('remote/base64')
  @ApiOperation({
    title: 'Get remote pdf',
    description: 'See external pdf',
  })
  @HttpCode(200)
  @ApiOkResponse({ type: PdfBase64ResponseDto })
  @ApiUseTags('Get remote Pdf')
  async getBase64(@Query() query: GetPdf) {
    const pdf = await this.get(query);
    return {
      pdf: pdf.toString('base64'),
    };
  }
}
