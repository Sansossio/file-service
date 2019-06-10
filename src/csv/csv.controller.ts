import { Controller, Post, Body } from '@nestjs/common';
import { CsvService } from './csv.service';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { JsonToCsvDto, CsvToJsonDto } from './csv.dto';

@Controller('csv')
@ApiUseTags('CSV')
export class CsvController {
  constructor(private readonly service: CsvService) {}

  @Post('convert/json')
  @ApiOperation({
    title: 'Convert json to csv format',
  })
  async jsonToCsv(@Body() { json }: JsonToCsvDto) {
    return await this.service.jsonToCsv(json);
  }

  @Post('convert/csv')
  @ApiOperation({
    title: 'Convert csv to json format',
  })
  async csvToJson(@Body() { csv }: CsvToJsonDto) {
    return await this.service.csvToJson(csv);
  }
}
