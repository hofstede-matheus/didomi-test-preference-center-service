import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsentModule } from '../src/consent/consent.module';
import { UserConsentTypeOrmEntity } from '../src/consent/infra/database/typeorm/entities/user-consent.entity';
import { UserTypeOrmEntity } from '../src/user/infra/database/typeorm/entities/user.entity';
import { UserModule } from '../src/user/user.module';

export const TEST_METADATA = {
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.test',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      migrations: ['src/core/database/typeorm/migrations/*.ts'],
      migrationsRun: true,
      entities: [UserTypeOrmEntity, UserConsentTypeOrmEntity],
      logging: process.env.DATABASE_LOGGING === 'true',
    }),
    UserModule,
    ConsentModule,
  ],
};
