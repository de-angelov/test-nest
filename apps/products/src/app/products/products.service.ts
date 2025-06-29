import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database.connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly categoriesService: CategoriesService
  ) {}

  async createProduct(
    product: Omit<typeof schema.products.$inferSelect, 'id'>
  ) {
    console.log('createProduct ', product);
    const category = await this.categoriesService.getCategoryByName(
      product.category
    );
    const newPrice = category ? product.price + category.charge : product.price;

    await this.database
      .insert(schema.products)
      .values({ ...product, price: newPrice });
  }
}
