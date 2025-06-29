import { Module } from '@nestjs/common';
import { LoadProductsConsumer } from './load-products.consumer';
import { PulsarModule } from '@jobber/pulsar';
import { ClientOptions, ClientsModule, Transport } from '@nestjs/microservices';
import { Packages } from '@jobber/grpc';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

const getProductsConfig = (configService: ConfigService) => {
  const config: ClientOptions = {
    transport: Transport.GRPC,
    options: {
      url: configService.getOrThrow('PRODUCTS_GRPC_SERVICE_URL'),
      package: Packages.PRODUCTS,
      protoPath: join(__dirname, '../../lib/grpc/proto/products.proto'),
    },
  };

  return config;
};

@Module({
  imports: [
    PulsarModule,
    ClientsModule.registerAsync([
      {
        name: Packages.PRODUCTS,
        inject: [ConfigService],
        useFactory: getProductsConfig,
      },
    ]),
  ],
  providers: [LoadProductsConsumer],
})
export class LoadProductsModule {}
