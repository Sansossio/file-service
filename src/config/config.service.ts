import * as Joi from 'joi';
import * as _ from 'lodash';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {
  private readonly envConfig: { [key: string]: any };

  constructor(filename: string) {
    this.envConfig = this.validateInput(Object.assign({}, require(`../../config/${filename}.json`), process.env));
  }

  get<T>(key: string): T {
    return _.get(this.envConfig, key);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'staging'])
        .default('development'),
      PORT: Joi.number().default(3000),

      // DB  SETTINGS
      DB_USER: Joi.string().required(),
      DB_PASSWORD: Joi.string()
        .allow('')
        .required(),
      DB_HOST: Joi.string().required(),
      DB_NAME: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(envConfig, envVarsSchema, {
      allowUnknown: true,
    });
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get nodeEnv(): string {
    return this.envConfig.NODE_ENV;
  }

  get port(): number {
    return parseInt(this.envConfig.PORT, 10);
  }
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.envConfig.DB_HOST,
      port: 5432,
      username: this.envConfig.DB_USER,
      password: this.envConfig.DB_PASSWORD,
      database: this.envConfig.DB_NAME,
      entities: [this.nodeEnv === 'production' ? 'dist/**/**.entity.js' : 'src/**/**.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    };
  }
}
