import { Module } from '@nestjs/common';
import { FibonacciJob } from './jobs/fibonacci/fibonacci.job';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { JobsService } from './jobs.service';
import { JobsResolver } from './jobs.resolver';
import { ClientOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { Packages } from '@jobber/grpc';
import { join } from 'path';
import { PulsarModule } from '@jobber/pulsar';
import { ConfigService } from '@nestjs/config';
import { LoadProductsJob } from './jobs/products/load-products.job';

const getAuthConfig = (configService: ConfigService) => {
  const config: ClientOptions = {
    transport: Transport.GRPC,
    options: {
      url: configService.getOrThrow('AUTH_GRPC_SERVICE_URL'),
      package: Packages.AUTH,
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
        name: Packages.AUTH,
        inject: [ConfigService],
        useFactory: getAuthConfig,
      },
    ]),
  ],
  providers: [LoadProductsJob, FibonacciJob, JobsService, JobsResolver],
})
export class JobModule {}
