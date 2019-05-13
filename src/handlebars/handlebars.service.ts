import { Injectable, HttpException } from '@nestjs/common';
import { compile, TemplateDelegate } from 'handlebars';
import { CompileHandlebarsDtoResponse } from './dto/compile.handlebars.dto';
import * as _ from 'lodash';

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
      throw new HttpException(
        {
          name: 'Error hbs',
          message: e.message,
        },
        500,
      );
    }
  }
}
