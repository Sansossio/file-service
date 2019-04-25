import { Controller, Get, Post, Body } from '@nestjs/common';
import { HandlebarsService } from './handlebars.service';
import { CompileHandlebarsDto, CompileHandlebarsDtoResponse } from './dto/compile.handlebars.dto';
import { ApiOkResponse, ApiUseTags } from '@nestjs/swagger';

@Controller('hbs')
@ApiUseTags('Handlebars')
export class HandlebarsController {
  constructor(private readonly service: HandlebarsService) {}

  @Post('compile')
  @ApiOkResponse({ type: CompileHandlebarsDtoResponse })
  compile(@Body() body: CompileHandlebarsDto) {
    return this.service.compile(body.template, body.data);
  }
}
