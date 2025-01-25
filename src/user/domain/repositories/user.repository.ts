import { User } from '../entities/user.entity';
import { Repository } from '../../../core/shared/interfaces/repository';

export interface UserRepository extends Repository<User> {
  create(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}

export const UserRepository = Symbol('UserRepository');
