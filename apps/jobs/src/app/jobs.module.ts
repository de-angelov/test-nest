import { Module } from '@nestjs/common';
import { FibonacciJob } from './jobs/fibonacci/fibonacci.job';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobsService } from './jobs.service';
import { JobsResolver } from './jobs.resolver';
import { ClientOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from '@jobber/grpc';
import { join } from 'path';
import { PulsarModule } from '@jobber/pulsar';
import { ConfigService } from '@nestjs/config';

const getAuthConfig = (configService: ConfigService) => {
  const config: ClientOptions = {
    transport: Transport.GRPC,
    options: {
      url: configService.getOrThrow('AUTH_GRPC_SERVICE_URL'),
      package: AUTH_PACKAGE_NAME,
      protoPath: join(__dirname, '../../lib/grpc/proto/auth.proto'),
    },
  };

  return config;
};

@Module({
  imports: [
    DiscoveryModule,
    PulsarModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_PACKAGE_NAME,
        inject: [ConfigService],
        useFactory: getAuthConfig,
      },
    ]),
  ],
  providers: [FibonacciJob, JobsService, JobsResolver],
})
export class JobModule {}
