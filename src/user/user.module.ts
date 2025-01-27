import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrmEntity } from './infra/database/typeorm/entities/user.entity';
import { UserController } from './infra/presentation/http/user.controller';
import { CreateUserUseCase } from './application/usecases/CreateUser.usecase';
import { UserRepository } from './domain/repositories/user.repository';
import { TypeOrmUsersRepository } from './infra/database/typeorm/repositories/TypeOrmUsersRepository';
import { UserService } from './domain/services/user.service';
import { GetUserUseCase } from './application/usecases/GetUser.usecase';
import { DeleteUserUseCase } from './application/usecases/DeleteUser.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntity])],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    DeleteUserUseCase,
    UserService,
    {
      provide: UserRepository,
      useClass: TypeOrmUsersRepository,
    },
  ],
  exports: [{ provide: UserRepository, useClass: TypeOrmUsersRepository }],
})
export class UserModule {}
