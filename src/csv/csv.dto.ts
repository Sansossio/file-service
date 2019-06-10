import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JsonToCsvDto {
  @ApiModelProperty()
  @IsNotEmpty()
  json: any;
}

export class CsvToJsonDto {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  csv: any;
}
