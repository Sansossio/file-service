import { Injectable, HttpException } from '@nestjs/common';
import { compile, TemplateDelegate } from 'handlebars';
import { CompileHandlebarsDtoResponse } from './dto/compile.handlebars.dto';

@Injectable()
export class HandlebarsService {
  compile(hbs: string, data: any): CompileHandlebarsDtoResponse {
    try {
      const template: TemplateDelegate = compile(hbs);
      return {
        html: template(data),
      };
    } catch (e) {
      delete e.stack;
      throw new HttpException(e, 500);
    }
  }
}
