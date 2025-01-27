import { Module } from '@nestjs/common';
import { UpdateUserConsentUseCase } from './application/usecases/UpdateUserConsent.usecase';

@Module({
  imports: [],
  controllers: [],
  providers: [UpdateUserConsentUseCase],
})
export class ConsentModule {}
