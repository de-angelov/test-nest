import { Packages } from '@jobber/grpc';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

const factory = (ConfigService: ConfigService): ClientOptions => ({
  transport: Transport.GRPC,
  options: {
    url: ConfigService.getOrThrow('JOBS_GRPC_SERVICE_URL'),
    package: Packages.JOBS,
    protoPath: join(__dirname, '../../lib/grpc/proto/jobs.proto'),
  },
});

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: Packages.JOBS,
        inject: [ConfigService],
        useFactory: factory,
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class JobClientsModule {}
