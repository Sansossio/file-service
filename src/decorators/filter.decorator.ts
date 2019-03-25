import { createParamDecorator, BadRequestException } from '@nestjs/common';
import * as _ from 'lodash';
import { Raw } from 'typeorm';

/**
 * Filter decorator
 * Simple: { where: { active: true } }
 * Extract data of req object: { where: { user: { source: 'req', target: 'body.user'} } }
 */
export const Filter = createParamDecorator((data, req) => {
  const requiredWhere = _.get(data, 'where');
  for (const option of _.keys(requiredWhere)) {
    const value: any = requiredWhere[option];
    const source: string = _.get(value, 'source');
    const target: string = _.get(value, 'target');
    if (source === 'req') {
      requiredWhere[option] = _.get(req, target);
    }
  }
  const filter = queryPipe(_.get(req, 'query.filter'), requiredWhere);
  return filter;
});

const queryPipe = (filter: any, requiredWhere) => {
  const query = { filter };
  try {
    query.filter = JSON.parse(query.filter);
    query.filter.where = query.filter.where || {};
    if (query.filter.where instanceof Array) {
      query.filter.where = query.filter.where.map(where => Object.assign(parseQuery(where), requiredWhere));
    } else {
      query.filter.where = Object.assign(parseQuery(query.filter.where), requiredWhere);
    }
    return query.filter;
  } catch (err) {
    throw new BadRequestException(err.message);
  }
};

const parseQuery = where => {
  for (const key of Object.keys(where)) {
    let query = where[key];
    let conector = '=';
    if (typeof query === 'object') {
      if (query.type) query.type = `::${query.type}`;
      if (query.method) query.method = query.method.toLowerCase();
      switch (query.method) {
        case 'between':
          conector = 'BETWEEN';
          query.value = `'${query.values[0]}'${query.type || ''} and '${query.values[1]}'${query.type || ''}`;
          break;
        case 'in':
          conector = 'IN';
          query.value = `(${query.values.map(value => `'${value}'`).join(',')})`;
          break;
        case 'like':
          conector = 'LIKE';
          query.value = `'${query.value}'${query.type || ''}`;
          break;
        case '>':
        case '<':
          conector = query.method;
          query.value = `'${query.value}'${query.type || ''}`;
          break;
        default:
          query.value = `'${query.value}'`;
          conector = '=';
      }
    }
    if (typeof query === 'string') {
      query = `'${query}'`;
    }
    let condition = `"${key}" ${conector} ${query.value || query}`;
    if (query.collection) {
      condition = `"${query.collection}".${condition}`;
      where[query.collection] = Raw(() => condition);
    }
    where[key] = Raw(() => condition);
  }
  return where;
};