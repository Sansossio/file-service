import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { INestApplication } from '@nestjs/common';

export function setSecurity(app: INestApplication) {
  app.use(bodyParser.json({ limit: '300mb' }));
  app.use(bodyParser.urlencoded({ limit: '300mb', extended: true }));
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 100 requests per windowMs
    }),
  );
}
