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
import { PrismaModule } from './prisma/prisma.module';
import { JobsController } from './jobs.controler';

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
    PrismaModule,
    ClientsModule.registerAsync([
      {
        name: Packages.AUTH,
        inject: [ConfigService],
        useFactory: getAuthConfig,
      },
    ]),
  ],
  controllers: [JobsController],
  providers: [LoadProductsJob, FibonacciJob, JobsService, JobsResolver],
})
export class JobModule {}
