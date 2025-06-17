import { Producer } from 'pulsar-client';
import { PulsarClient } from '@jobber/pulsar';
import { OnModuleDestroy } from '@nestjs/common';

export abstract class AbstractJob<T> implements OnModuleDestroy {
  private producer!: Producer;

  constructor(private readonly pulsarClient: PulsarClient) {}
  async onModuleDestroy() {
    await this.producer.close();
  }

  async execute(data: T, job: string) {
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(job);
    }

    await this.producer.send({
      data: Buffer.from(JSON.stringify(data)),
    });
  }
}
