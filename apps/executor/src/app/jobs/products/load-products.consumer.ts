import {
  Packages,
  PRODUCTS_SERVICE_NAME,
  ProductsServiceClient,
} from '@jobber/grpc';
import { Jobs } from '@jobber/nestjs';
import {
  LoadProductsMessage,
  PulsarClient,
  PulsarConsumer,
} from '@jobber/pulsar';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LoadProductsConsumer
  extends PulsarConsumer<LoadProductsMessage>
  implements OnModuleInit
{
  private productsService: ProductsServiceClient;

  constructor(
    pulsarClient: PulsarClient,
    @Inject(Packages.PRODUCTS) private clientGrpc: ClientGrpc
  ) {
    super(pulsarClient, Jobs.LOAD_PRODUCTS);
  }

  async onModuleInit(): Promise<void> {
    this.productsService = this.clientGrpc.getService(PRODUCTS_SERVICE_NAME);

    super.onModuleInit();
  }

  protected async onMessage(data: LoadProductsMessage) {
    console.log('On message: ', data);
    const createObs = this.productsService.createProduct(data);

    await firstValueFrom(createObs);
  }
}
