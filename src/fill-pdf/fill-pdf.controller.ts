import { Controller, Post, UseInterceptors, UploadedFile, HttpCode } from '@nestjs/common';
import { FillPdfService } from './fill-pdf.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiImplicitFile, ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { FillPdfResponseDto } from './fill-pdf.dto';

@Controller('pdf')
@ApiUseTags('Fill pdf')
export class FillPdfController {
  constructor(private readonly service: FillPdfService) {}

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
  async fill(@UploadedFile() file) {
    return await this.service.getKeys(file);
  }
}
