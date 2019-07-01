import { Module } from '@nestjs/common';
import { PdfController } from './pdf.controller';
import { PdfService } from './pdf.service';
import { FileService } from '../file/file.service';

@Module({
  controllers: [PdfController],
  providers: [FileService, PdfService],
  exports: [PdfService],
})
export class PdfModule {}
