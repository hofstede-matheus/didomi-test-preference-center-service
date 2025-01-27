import { User } from '../entities/user.entity';

export interface UserRepository {
  create(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}

export const UserRepository = Symbol('UserRepository');
