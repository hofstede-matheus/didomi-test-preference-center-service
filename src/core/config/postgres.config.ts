import { env } from 'node:process';
import { registerAs } from '@nestjs/config';

export default registerAs('postgres', () => ({
  host: env.POSTGRES_HOST,
  port: parseInt(env.POSTGRES_PORT || '5432', 10),
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  logging: env.POSTGRES_LOGGING || false,
}));
