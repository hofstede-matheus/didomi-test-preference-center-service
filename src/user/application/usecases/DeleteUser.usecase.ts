import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../core/shared/helpers/usecase';
import { UserRepository } from '../../domain/repositories/user.repository';
import { validate } from 'uuid';

@Injectable()
export class DeleteUserUseCase implements UseCase {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    if (!validate(id)) {
      return;
    }
    await this.userRepository.delete(id);
  }
}
