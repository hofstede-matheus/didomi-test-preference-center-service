import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../../application/usecases/CreateUser.usecase';
import { CreateUserRequest } from './dto/create-user';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() body: CreateUserRequest): Promise<void> {
    await this.createUserUseCase.execute(body.email);
    return;
  }
}
