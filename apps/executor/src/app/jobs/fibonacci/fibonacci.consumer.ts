import { Injectable, OnModuleInit } from '@nestjs/common';
import { PulsarConsumer } from 'lib/pulsar/src/lib/pulsar.consumer';
import { iterate } from 'fibonacci';
import { FibonacciMessage, PulsarClient } from '@jobber/pulsar';
import { Jobs } from '@jobber/nestjs';
@Injectable()
export class FibonacciConsumer
  extends PulsarConsumer<FibonacciMessage>
  implements OnModuleInit
{
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, Jobs.FIBONACCI);
  }

  protected async onMessage(data: FibonacciMessage): Promise<void> {
    const result = iterate(data.iterations);
    this.logger.log(result);
  }

  OnModuleInit() {
    console.log('onModuleInit');
  }
}
