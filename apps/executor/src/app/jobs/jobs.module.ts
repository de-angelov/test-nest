import { PulsarModule } from 'lib/pulsar/src/lib/pulsar.module';
import { Module } from '@nestjs/common';
import { FibonacciConsumer } from './fibonacci/fibonacci.consumer';

@Module({
  imports: [PulsarModule],
  providers: [FibonacciConsumer],
})
export class JobsModule {}
