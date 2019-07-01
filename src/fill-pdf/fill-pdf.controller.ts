import { Controller, Post, UseInterceptors, UploadedFile, HttpCode, Body, Res, Header } from '@nestjs/common';
import { FillPdfService } from './fill-pdf.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiImplicitFile, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { FillPdfResponseDto, FillPdfRequestDto } from './fill-pdf.dto';
import { PdfService } from '../pdf/pdf.service';

@Controller('pdf')
@ApiUseTags('Fill pdf')
export class FillPdfController {
  constructor(private readonly service: FillPdfService, private readonly pdfSrrvice: PdfService) {}

  @Post('fill/keys')
  @ApiOperation({
    title: 'Get fillable pdf keys',
  })
  @ApiImplicitFile({
    name: 'file',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({
    type: [FillPdfResponseDto],
  })
  @HttpCode(200)
  async keys(@UploadedFile() file) {
    return await this.service.getKeys(file);
  }

  @Post('fill')
  @ApiOperation({
    title: 'Fill pdf',
  })
  @HttpCode(200)
  @Header('Content-Type', 'application/pdf')
  async fill(@Body() data: FillPdfRequestDto, @Res() response) {
    const buffer = await this.service.writePdf(data);
    return this.pdfSrrvice.responsePdf(response, buffer);
  }
}
