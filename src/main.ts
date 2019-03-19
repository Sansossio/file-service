import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from './config/config.service';
import { setSecurity } from './security';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  setSecurity(app);
  const config = app.get(ConfigService);
  const port: number = config.get<number>('application.port');

  const options = new DocumentBuilder()
    .setTitle('Template API')
    .setDescription('API definition for a new project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('explorer', app, document);

  await app.listen(port);
}
bootstrap();
