import { ApiModelProperty, ApiResponseModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class GetFile {
  @ApiModelProperty()
  @IsNotEmpty()
  @IsUrl()
  url: string;
}

export class ResponseFile {
  @ApiResponseModelProperty()
  file: string;
}
