import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

const factory = (configService: ConfigService) => {
  const isProduction = configService.get('NODE_ENV');
  const transportDev = {
    target: 'pino-pretty',
    options: {
      singleLine: true,
    },
  };
  return {
    pinoHttp: {
      transport: isProduction ? undefined : transportDev,
      level: isProduction ? 'info' : 'debug',
    },
  };
};

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      useFactory: factory,
      inject: [ConfigService],
    }),
  ],
})
export class LoggerModule {}
