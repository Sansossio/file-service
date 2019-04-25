import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PdfModule } from './pdf/pdf.module';
import { HandlebarsModule } from './handlebars/handlebars.module';

@Module({
  imports: [ConfigModule, PdfModule, HandlebarsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
