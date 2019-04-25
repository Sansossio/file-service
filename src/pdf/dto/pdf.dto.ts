import { ApiModelProperty, ApiModelPropertyOptional, ApiResponseModelProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { PDFFormat } from 'puppeteer';

export class PdfDto {
  @ApiModelProperty()
  @IsString()
  html: string;

  @ApiModelPropertyOptional()
  @IsString()
  @IsOptional()
  header?: string;

  @ApiModelPropertyOptional()
  @IsString()
  @IsOptional()
  footer?: string;

  @ApiModelProperty({
    example: 'A4',
  })
  @IsString()
  @IsOptional()
  pageFormat?: PDFFormat;

  @ApiModelPropertyOptional({
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  printBackground?: boolean;

  @ApiModelPropertyOptional({
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  landscape?: boolean;
}

export class PdfMergeDto {
  @ApiModelProperty()
  @IsArray()
  pdf: string[];
}

export class PdfBase64ResponseDto {
  @ApiResponseModelProperty()
  pdf: string;
}
