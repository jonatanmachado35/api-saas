import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserUseCase } from '../register-user.use-case';
import { BcryptHasher } from '../../../infra/hashing/bcrypt.hasher';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { User, UserRole } from '../../../domain/entities/user.entity';
import { PrismaService } from '../../../../prisma/prisma.service';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let hasher: jest.Mocked<BcryptHasher>;
  let jwtService: jest.Mocked<JwtService>;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findByGoogleId: jest.fn(),
      findByGithubId: jest.fn(),
      findAll: jest.fn(),
    };

    const mockHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const mockPrismaService = {
      subscription: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        { provide: 'UserRepository', useValue: mockUserRepository },
        { provide: BcryptHasher, useValue: mockHasher },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    useCase = module.get<RegisterUserUseCase>(RegisterUserUseCase);
    userRepository = module.get('UserRepository');
    hasher = module.get(BcryptHasher);
    jwtService = module.get(JwtService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const validInput = {
      email: 'test@example.com',
      password: 'password123',
      full_name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      hasher.hash.mockResolvedValue('hashed_password');
      jwtService.sign.mockReturnValue('jwt_token');
      userRepository.save.mockResolvedValue();
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'FREE',
      });

      const result = await useCase.execute(validInput);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
      expect(hasher.hash).toHaveBeenCalledWith(validInput.password);
      expect(userRepository.save).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token', 'jwt_token');
      expect(result.user.email).toBe(validInput.email);
      expect(result.user.plan).toBe('FREE');
    });

    it('should throw ConflictException if email already exists', async () => {
      const existingUser = new User(
        {
          email: validInput.email,
          password: 'hashed',
          role: UserRole.USER,
        },
        'existing-id',
      );
      userRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(useCase.execute(validInput)).rejects.toThrow(ConflictException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if password is too short', async () => {
      const shortPasswordInput = {
        ...validInput,
        password: '12345',
      };

      await expect(useCase.execute(shortPasswordInput)).rejects.toThrow(BadRequestException);
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if password is empty', async () => {
      const emptyPasswordInput = {
        ...validInput,
        password: '',
      };

      await expect(useCase.execute(emptyPasswordInput)).rejects.toThrow(BadRequestException);
    });

    it('should create user with USER role by default', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      hasher.hash.mockResolvedValue('hashed_password');
      jwtService.sign.mockReturnValue('jwt_token');
      userRepository.save.mockResolvedValue();

      const result = await useCase.execute(validInput);

      expect(result.user.role).toBe(UserRole.USER);
    });
  });
});
