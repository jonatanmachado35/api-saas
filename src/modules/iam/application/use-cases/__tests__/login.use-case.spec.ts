import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUseCase } from '../login.use-case';
import { BcryptHasher } from '../../../infra/hashing/bcrypt.hasher';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { User, UserRole } from '../../../domain/entities/user.entity';
import { PrismaService } from '../../../../prisma/prisma.service';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let hasher: jest.Mocked<BcryptHasher>;
  let jwtService: jest.Mocked<JwtService>;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUser = new User(
    {
      email: 'test@example.com',
      password: 'hashed_password',
      fullName: 'Test User',
      role: UserRole.USER,
    },
    'user-id-123',
  );

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
        LoginUseCase,
        { provide: 'UserRepository', useValue: mockUserRepository },
        { provide: BcryptHasher, useValue: mockHasher },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
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
    };

    it('should login successfully with valid credentials', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      hasher.compare.mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt_token');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'FREE',
      });

      const result = await useCase.execute(validInput);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(validInput.email);
      expect(hasher.compare).toHaveBeenCalledWith(validInput.password, mockUser.password);
      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token', 'jwt_token');
      expect(result.user).toHaveProperty('plan', 'FREE');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(useCase.execute(validInput)).rejects.toThrow(UnauthorizedException);
      expect(hasher.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      hasher.compare.mockResolvedValue(false);

      await expect(useCase.execute(validInput)).rejects.toThrow(UnauthorizedException);
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should return user metadata in response', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      hasher.compare.mockResolvedValue(true);
      jwtService.sign.mockReturnValue('jwt_token');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'PRO',
      });

      const result = await useCase.execute(validInput);

      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(mockUser.email);
      expect(result.user.plan).toBe('PRO');
    });
  });
});
