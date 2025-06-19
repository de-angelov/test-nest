import { PulsarClient, serialize } from '@jobber/pulsar';
import { Producer } from 'pulsar-client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
export abstract class AbstractJob<T extends object> {
  private producer!: Producer;
  protected abstract messageClass: new () => T;

  constructor(private readonly pulsarClient: PulsarClient) {}

  async execute(data: T, job: string) {
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(job);
    }

    const finalData = Array.isArray(data) ? data : [data];

    for (const message of finalData) {
      await this.validateData(message);
      await this.send(message);
    }
  }

  private async send(data: T) {
    await this.producer.send({
      data: serialize(data),
    });
  }

  private async validateData(data: T) {
    const errors = await validate(plainToInstance(this.messageClass, data));

    if (errors.length > 0) {
      throw new BadRequestException(
        'Job data is invalid: ' + JSON.stringify(errors)
      );
    }
  }
}
