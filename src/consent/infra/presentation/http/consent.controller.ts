import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { UpdateUserConsentUseCase } from '../../../application/usecases/UpdateUserConsent.usecase';
import { CreateUserConsentEventRequest } from './dto/create-event';
import { DomainErrorToHttpExceptionFilter } from '../../../../core/infra/presentation/http/filters/domain-error-to-http-exception.filter';

@UseFilters(DomainErrorToHttpExceptionFilter)
@Controller('events')
export class ConsentController {
  constructor(
    private readonly updateUserConsentUseCase: UpdateUserConsentUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateUserConsentEventRequest): Promise<void> {
    await this.updateUserConsentUseCase.execute(body);
  }
}
