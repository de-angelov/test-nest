import { PulsarModule } from 'lib/pulsar/src/lib/pulsar.module';
import { Module } from '@nestjs/common';
import { FibonacciConsumer } from './fibonacci/fibonacci.consumer';
import { LoadProductsModule } from './products/load-products.module';
import { JobClientsModule } from './job.clients.module';
@Module({
  imports: [PulsarModule, JobClientsModule, LoadProductsModule],
  providers: [FibonacciConsumer],
})
export class JobsModule {}
