import { PulsarModule } from 'lib/pulsar/src/lib/pulsar.module';
import { Module } from '@nestjs/common';
import { FibonacciConsumer } from './fibonacci/fibonacci.consumer';
import { LoadProductsModule } from './products/load-products.module';
@Module({
  imports: [PulsarModule, LoadProductsModule],
  providers: [FibonacciConsumer],
})
export class JobsModule {}
