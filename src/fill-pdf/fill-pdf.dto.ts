import { ApiResponseModelProperty } from '@nestjs/swagger';

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
