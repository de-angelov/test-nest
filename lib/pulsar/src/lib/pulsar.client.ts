import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pulsar-client';

@Injectable()
export class PulsarClient implements OnModuleDestroy {
  private readonly client = new Client({
    serviceUrl: this.configService.getOrThrow('PULSAR_SERVICE_URL'),
  });
  constructor(private readonly configService: ConfigService) {}
  async onModuleDestroy() {
    await this.client.close();
  }

  async createProducer(topic: string) {
    return this.client.createProducer({ topic });
  }
}
