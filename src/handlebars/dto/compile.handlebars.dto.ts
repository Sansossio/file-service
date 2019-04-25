import { ApiModelProperty, ApiResponseModelProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CompileHandlebarsDto {
  @ApiModelProperty()
  @IsString()
  template: string;

  @ApiModelProperty()
  @IsNotEmpty()
  data: Object;
}

export class CompileHandlebarsDtoResponse {
  @ApiResponseModelProperty()
  html: string;
}
