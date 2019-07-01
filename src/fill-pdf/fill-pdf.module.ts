import { Module } from '@nestjs/common';

import { PdfModule } from '../pdf/pdf.module';
import { FillPdfController } from './fill-pdf.controller';
import { FillPdfService } from './fill-pdf.service';

@Module({
  imports: [PdfModule],
  controllers: [FillPdfController],
  providers: [FillPdfService],
})
export class FillPdfModule {}

/**
 * brew rm poppler; brew install -s poppler
 * export PKG_CONFIG_PATH="/usr/local/opt/libffi/lib/pkgconfig"
 * npm install pdf-fill-form
 */
