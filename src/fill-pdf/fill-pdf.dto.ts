import { ApiResponseModelProperty, ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBase64, IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FillPdfResponseDto {
  @ApiResponseModelProperty()
  name: string;

  @ApiResponseModelProperty()
  page: number;

  @ApiResponseModelProperty()
  value: boolean | string | number;

  @ApiResponseModelProperty()
  id: number;

  @ApiResponseModelProperty()
  type: string;
}

export class FillPdfRequestDtoData {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiModelProperty({
    example: 'X',
  })
  @IsNotEmpty()
  value: any;
}

export class FillPdfRequestDto {
  @ApiModelProperty()
  @IsNotEmpty()
  @IsBase64()
  file: string;

  @ApiModelProperty({
    type: [FillPdfRequestDtoData],
  })
  @IsNotEmpty()
  @IsArray()
  @Type(() => FillPdfRequestDtoData)
  @ValidateNested({ each: true })
  data: FillPdfRequestDtoData[];
}
