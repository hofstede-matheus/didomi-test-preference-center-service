import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserNotFoundError } from '../../domain/errors/errors';
import { User } from '../../domain/entities/user.entity';
import { GetUserUseCase } from './GetUser.usecase';
import { v4 as uuidv4 } from 'uuid';

describe('GetUserUseCase', () => {
  let getUserUseCase: GetUserUseCase;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    getUserUseCase = module.get<GetUserUseCase>(GetUserUseCase);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should get a user', async () => {
    // Arrange
    const validId = uuidv4();
    const validEmail = 'valid@email.com';
    jest
      .spyOn(userRepository, 'findById')
      .mockResolvedValueOnce(new User({ email: validEmail }));

    // Act
    const user = await getUserUseCase.execute(validId);

    // Assert
    expect(user).toBeDefined();
    if (user) {
      expect(userRepository.findById).toHaveBeenCalledTimes(1);

      expect(user.id).toBeDefined();
      expect(user.email).toEqual(validEmail);
      expect(user.consents).toEqual([]);
    }
  });

  it('should throw an error when user is not found', async () => {
    // Arrange
    const invalidId = uuidv4();
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(null);

    // Act & Assert
    await expect(getUserUseCase.execute(invalidId)).rejects.toThrow(
      UserNotFoundError,
    );
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when querying a user with invalid id', async () => {
    // Arrange
    const invalidId = 'invalid-id';
    jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(null);

    // Act & Assert
    await expect(getUserUseCase.execute(invalidId)).rejects.toThrow(
      UserNotFoundError,
    );
    expect(userRepository.findById).toHaveBeenCalledTimes(0);
  });
});
