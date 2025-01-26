import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

console.log(process.env.POSTGRES_USERNAME);

export const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,

  synchronize: false,
  logging: process.env.DATABASE_LOGGING === 'true',

  entities: ['src/core/database/typeorm/entities/*.ts'],
  migrations: ['src/core/database/typeorm/migrations/*.ts'],
});
