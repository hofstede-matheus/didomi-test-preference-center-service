import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../core/shared/helpers/usecase';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserService } from '../../domain/services/user.service';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class CreateUserUseCase implements UseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,

    private readonly userService: UserService,
  ) {}

  async execute(email: string): Promise<User> {
    const user = new User({ email });
    await this.userService.checkIfUserExists(user.email);

    await this.userRepository.create(user);
    return user;
  }
}
