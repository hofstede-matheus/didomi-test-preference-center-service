import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserService } from '../../domain/services/user.service';
import { CreateUserUseCase } from './CreateUser.usecase';
import {
  InvalidUserEmailError,
  UserEmailAlreadyExistsError,
} from '../../domain/errors/errors';
import { User } from '../../domain/entities/user.entity';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        UserService,
      ],
    }).compile();

    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should not create an user with invalid email', async () => {
    // Arrange
    const email = 'invalid-email';

    // Act & Assert
    await expect(createUserUseCase.execute(email)).rejects.toThrow(
      InvalidUserEmailError,
    );
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(0);
    expect(userRepository.create).toHaveBeenCalledTimes(0);
  });

  it('should not create an user with already existing email', async () => {
    // Arrange
    const email = 'valid@email.com';
    jest
      .spyOn(userRepository, 'findByEmail')
      .mockResolvedValueOnce(new User({ email }));

    // Act & Assert
    await expect(createUserUseCase.execute(email)).rejects.toThrow(
      UserEmailAlreadyExistsError,
    );
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepository.create).toHaveBeenCalledTimes(0);
  });

  it('should create an user', async () => {
    // Arrange
    const email = 'valid@email.com';
    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);

    // Act
    await createUserUseCase.execute(email);

    // Assert
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepository.create).toHaveBeenCalledTimes(1);
  });
});
