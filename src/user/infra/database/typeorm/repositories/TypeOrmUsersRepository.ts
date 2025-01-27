import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../../../domain/repositories/user.repository';
import { UserTypeOrmEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { User } from '../../../../domain/entities/user.entity';

export class TypeOrmUsersRepository implements UserRepository {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly repository: Repository<UserTypeOrmEntity>,
  ) {}

  async create(user: User): Promise<void> {
    const userEntity = this.repository.create(user);
    await this.repository.save(userEntity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOneBy({ email });
    return user ? new User(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { id },
    });
    return user ? new User(user) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
    return;
  }
}
