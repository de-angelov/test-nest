import { Global, Module } from '@nestjs/common';
import { DATABASE_CONNECTION } from './database.connection';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as productsSchema from '../products/schema';
import * as categoriesSchema from '../categories/schema';

const dbFactory = (configService: ConfigService) => {
  const pool = new Pool({
    connectionString: configService.getOrThrow('DATABASE_URL'),
  });

  const drizzleOptions = {
    schema: { ...productsSchema, ...categoriesSchema },
  };

  return drizzle(pool, drizzleOptions);
};

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      inject: [ConfigService],
      useFactory: dbFactory,
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
