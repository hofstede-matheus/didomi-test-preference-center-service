import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { CreateUserUseCase } from '../../../application/usecases/CreateUser.usecase';
import { CreateUserRequest, CreateUserResponse } from './dto/create-user';
import { DomainErrorToHttpExceptionFilter } from './filters/domain-error-to-http-exception.filter';

@UseFilters(DomainErrorToHttpExceptionFilter)
@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() body: CreateUserRequest): Promise<CreateUserResponse> {
    return this.createUserUseCase.execute(body.email);
  }
}
