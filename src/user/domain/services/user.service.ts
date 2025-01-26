import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEmailAlreadyExistsError } from '../errors/errors';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async checkIfUserExists(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new UserEmailAlreadyExistsError(email);
    }
  }
}
