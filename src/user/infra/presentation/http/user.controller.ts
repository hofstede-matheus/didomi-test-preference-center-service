import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../../application/usecases/CreateUser.usecase';
import { CreateUserRequest, CreateUserResponse } from './dto/create-user';
import { DomainErrorToHttpExceptionFilter } from '../../../../core/infra/presentation/http/filters/domain-error-to-http-exception.filter';
import { GetUserRequest, GetUserResponse } from './dto/get-user';
import { GetUserUseCase } from '../../../application/usecases/GetUser.usecase';
import { DeleteUserUseCase } from '../../../application/usecases/DeleteUser.usecase';
import { DeleteUserRequest } from './dto/delete-user';
import { ApiResponse } from '@nestjs/swagger';

@UseFilters(DomainErrorToHttpExceptionFilter)
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiResponse({ status: 201, type: CreateUserResponse })
  async create(@Body() body: CreateUserRequest): Promise<CreateUserResponse> {
    const user = await this.createUserUseCase.execute(body.email);

    return {
      id: user.id,
      email: user.email,
      consents: user.consents.map((consent) => {
        return {
          id: consent.id,
          enabled: consent.enabled,
        };
      }),
    };
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: GetUserResponse })
  async get(@Param() params: GetUserRequest): Promise<GetUserResponse> {
    const user = await this.getUserUseCase.execute(params.id);

    return {
      id: user.id,
      email: user.email,
      consents: user.consents.map((consent) => {
        return {
          id: consent.id,
          enabled: consent.enabled,
        };
      }),
    };
  }

  @Delete(':id')
  @ApiResponse({ status: 200 })
  async delete(@Param() params: DeleteUserRequest): Promise<void> {
    await this.deleteUserUseCase.execute(params.id);
  }
}
