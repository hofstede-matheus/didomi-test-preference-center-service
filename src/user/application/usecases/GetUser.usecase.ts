import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../core/shared/helpers/usecase';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../../domain/errors/errors';
import { validate } from 'uuid';

@Injectable()
export class GetUserUseCase implements UseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<User> {
    if (!validate(id)) {
      throw new UserNotFoundError(id);
    }
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError(id);
    }
    return user;
  }
}
