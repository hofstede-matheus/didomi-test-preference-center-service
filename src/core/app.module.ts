import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/postgres.config';
import { UserModule } from '../user/user.module';
import { ConsentModule } from '../consent/consent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('postgres.host'),
        port: configService.get('postgres.port'),
        username: configService.get('postgres.username'),
        password: configService.get('postgres.password'),
        database: configService.get('postgres.database'),
        synchronize: configService.get('postgres.synchronize'),
        logging: configService.get('postgres.logging'),
        migrationsRun: configService.get('postgres.migrationsRun'),
        migrations: configService.get('postgres.migrations'),
        entities: configService.get('postgres.entities'),
      }),
    }),
    UserModule,
    ConsentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
