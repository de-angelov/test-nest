import { Injectable, OnModuleInit } from '@nestjs/common';
import { PulsarClient } from '../../../../../../lib/pulsar/src/lib/pulsar.client';
import { PulsarConsumer } from '../../../../../../lib/pulsar/src/lib/pulsar.consumer';
import { iterate } from 'fibonacci';
import { FibonacciData } from './fibonacci.data.interface';
@Injectable()
export class FibonacciConsumer
  extends PulsarConsumer<FibonacciData>
  implements OnModuleInit
{
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, 'Fibonacci');
  }

  protected async onMessage(data: FibonacciData): Promise<void> {
    const result = iterate(data.iterations);
    this.logger.log(result);
  }

  OnModuleInit() {
    console.log('onModuleInit');
  }
}
