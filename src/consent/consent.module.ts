import { Module } from '@nestjs/common';
import { UpdateUserConsentUseCase } from './application/usecases/UpdateUserConsent.usecase';
import { TypeOrmUsersRepository } from '../user/infra/database/typeorm/repositories/TypeOrmUsersRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConsentTypeOrmEntity } from './infra/database/typeorm/entities/user-consent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserConsentTypeOrmEntity])],
  controllers: [],
  providers: [UpdateUserConsentUseCase, TypeOrmUsersRepository],
  exports: [TypeOrmUsersRepository],
})
export class ConsentModule {}
