import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';

import * as chromeModule from 'puppeteer';
import * as rp from 'request-promise';
import * as hummus from 'hummus';
import { WritableStream } from 'memory-streams';
import { PdfDto, PdfMergeDto, PdfMergeUrl } from './dto/pdf.dto';
import { Response } from 'express-serve-static-core';
import { Readable } from 'stream';
import { FileService } from '../file/file.service';

@Injectable()
export class PdfService {
  private readonly chromeArgs: string[] = ['--no-sandbox', '--disable-setuid-sandbox', '--headless', '--disable-gpu'];

  constructor(private readonly fileService: FileService) {}

  responsePdf(res: Response, pdf: Buffer) {
    const stream = new Readable();
    stream.push(pdf);
    stream.push(null);
    stream.pipe(res);
    return;
  }

  async merge(data: PdfMergeDto) {
    const { pdf } = data;
    if (!pdf || !pdf.length) {
      throw new InternalServerErrorException('No pdf found to merge');
    }
    const buffers: Buffer[] = pdf.map((val: string) => Buffer.from(val, 'base64'));
    const outStream = new WritableStream();
    try {
      const allPdfBuffers = buffers.map((val: Buffer) => {
        const buffer: Buffer = Buffer.from(val);
        return new hummus.PDFRStreamForBuffer(buffer);
      });
      const pdfWriter = hummus.createWriterToModify(allPdfBuffers.shift(), new hummus.PDFStreamForResponse(outStream));
      for (const buffer of allPdfBuffers) {
        pdfWriter.appendPDFPagesFromPDF(buffer);
      }
      pdfWriter.end();
      return outStream.toBuffer();
    } catch (e) {
      throw new InternalServerErrorException('Error merging pdf', e);
    } finally {
      outStream.end();
    }
  }

  async mergeRemote(data: PdfMergeUrl) {
    const { pdfs } = data;
    if (!pdfs.length) {
      throw new BadRequestException('Pdfs are required');
    }
    const pdfData: string[] = [];
    for (const pdf of pdfs) {
      const pdfBuffer: Buffer = await this.fileService.get(pdf.url);
      pdfData.push(pdfBuffer.toString('base64'));
    }
    return await this.merge({
      pdf: pdfData,
    });
  }

  async generate(data: PdfDto) {
    const browser: chromeModule.Browser = await chromeModule.launch({
      args: this.chromeArgs,
      executablePath: process.env.CHROME_BIN || null,
      headless: true,
    });
    const page: chromeModule.Page = await browser.newPage();
    await page.setContent(data.html, { waitUntil: 'networkidle2' });
    const bufferPdf: Buffer = await page.pdf({
      format: data.pageFormat || 'A4',
      printBackground: data.printBackground,
      landscape: data.landscape,
      headerTemplate: data.header,
      displayHeaderFooter: !!data.footer || !!data.header,
      footerTemplate: data.footer,
    });
    await page.close();
    await browser.close();
    return bufferPdf;
  }
}
