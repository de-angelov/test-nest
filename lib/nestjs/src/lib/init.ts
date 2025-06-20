import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

export async function init(app: INestApplication) {
  const globalPrefix = 'api';

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix(globalPrefix);
  app.useLogger(app.get(Logger));
  app.use(cookieParser());

  const port = app.get(ConfigService).getOrThrow('PORT');
  await app.listen(port);
}
