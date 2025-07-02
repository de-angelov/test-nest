import { PulsarClient, serialize } from '@jobber/pulsar';
import { Producer } from 'pulsar-client';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobStatus } from '../models/job-status.enum';
export abstract class AbstractJob<T extends object> {
  private producer!: Producer;
  protected abstract messageClass: new () => T;

  constructor(
    private readonly pulsarClient: PulsarClient,
    private readonly prismaService: PrismaService
  ) {}

  async execute(data: T, name: string) {
    if (!this.producer) {
      this.producer = await this.pulsarClient.createProducer(name);
    }

    const size = Array.isArray(data) ? data.length : 1;
    const jobConfig = {
      name,
      size,
      completed: 0,
      status: JobStatus.IN_PROGRESS,
    };

    const job = await this.prismaService.job.create({ data: jobConfig });

    const finalData = Array.isArray(data) ? data : [data];

    for (const message of finalData) {
      this.send({ ...message, jobId: job.id });
    }

    return job;
  }

  private send(data: T) {
    this.validateData(data).then(() =>
      this.producer.send({ data: serialize(data) })
    );
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
