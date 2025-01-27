import { forwardRef, Module } from '@nestjs/common';
import { UpdateUserConsentUseCase } from './application/usecases/UpdateUserConsent.usecase';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConsentTypeOrmEntity } from './infra/database/typeorm/entities/user-consent.entity';
import { UserModule } from '../user/user.module';
import { UserConsentRepository } from './domain/repositories/user-consent.repository';
import { TypeOrmUserConsentRepository } from './infra/database/typeorm/repositories/TypeOrmUserConsentRepository';
import { ConsentController } from './infra/presentation/http/consent.controller';
import { UserTypeOrmEntity } from '../user/infra/database/typeorm/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserConsentTypeOrmEntity]),
    TypeOrmModule.forFeature([UserTypeOrmEntity]),
    UserModule,
  ],
  controllers: [ConsentController],
  providers: [
    UpdateUserConsentUseCase,
    {
      provide: UserConsentRepository,
      useClass: TypeOrmUserConsentRepository,
    },
  ],
  exports: [
    {
      provide: UserConsentRepository,
      useClass: TypeOrmUserConsentRepository,
    },
  ],
})
export class ConsentModule {}
