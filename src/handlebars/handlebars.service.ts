import { Injectable } from '@nestjs/common';
import { compile, TemplateDelegate } from 'handlebars';
import { CompileHandlebarsDtoResponse } from './dto/compile.handlebars.dto';

@Injectable()
export class HandlebarsService {
  compile(hbs: string, data: any): CompileHandlebarsDtoResponse {
    const template: TemplateDelegate = compile(hbs);
    return {
      html: template(data),
    };
  }
}
