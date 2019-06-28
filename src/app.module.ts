import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PdfModule } from './pdf/pdf.module';
import { HandlebarsModule } from './handlebars/handlebars.module';
import { FileModule } from './file/file.module';
import { CsvModule } from './csv/csv.module';
import { FillPdfModule } from './fill-pdf/fill-pdf.module';

@Module({
  imports: [ConfigModule, PdfModule, HandlebarsModule, FileModule, CsvModule, FillPdfModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
