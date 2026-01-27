import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ValidateSessionUseCase } from '../validate-session.use-case';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { PrismaService } from '../../../../prisma/prisma.service';
import { User, UserRole } from '../../../domain/entities/user.entity';

describe('ValidateSessionUseCase', () => {
  let useCase: ValidateSessionUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUser = new User(
    {
      email: 'test@example.com',
      password: 'hashed-password',
      fullName: 'Test User',
      avatarUrl: 'https://avatar.url',
      role: UserRole.USER,
    },
    'user-id-123',
  );

  beforeEach(async () => {
    const mockUserRepository = {
      findById: jest.fn(),
    };

    const mockPrismaService = {
      subscription: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateSessionUseCase,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    useCase = module.get<ValidateSessionUseCase>(ValidateSessionUseCase);
    userRepository = module.get('UserRepository');
    prismaService = module.get(PrismaService);
  });

  describe('Comportamento: Validação de sessão válida', () => {
    it('deve retornar dados do usuário quando sessão é válida', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'PRO',
        user_id: mockUser.id,
      });

      // Act
      const result = await useCase.execute('user-id-123');

      // Assert
      expect(result).toHaveProperty('user');
      expect(result.user.id).toBe('user-id-123');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.role).toBe(UserRole.USER);
      expect(result.user.plan).toBe('PRO');
      expect(userRepository.findById).toHaveBeenCalledWith('user-id-123');
    });

    it('deve incluir user_metadata na resposta', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await useCase.execute('user-id-123');

      // Assert
      expect(result.user).toHaveProperty('user_metadata');
      expect(result.user.user_metadata.full_name).toBe('Test User');
      expect(result.user.user_metadata.avatar_url).toBe('https://avatar.url');
    });

    it('deve retornar plano FREE quando não há subscription', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await useCase.execute('user-id-123');

      // Assert
      expect(result.user.plan).toBe('FREE');
    });

    it('deve retornar plano correto quando há subscription', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'CUSTOM',
        user_id: mockUser.id,
      });

      // Act
      const result = await useCase.execute('user-id-123');

      // Assert
      expect(result.user.plan).toBe('CUSTOM');
      expect(prismaService.subscription.findUnique).toHaveBeenCalledWith({
        where: { user_id: 'user-id-123' },
      });
    });
  });

  describe('Comportamento: Validação de sessão inválida', () => {
    it('deve lançar UnauthorizedException quando usuário não existe', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute('invalid-user-id')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(useCase.execute('invalid-user-id')).rejects.toThrow('User not found');
    });

    it('deve verificar usuário antes de buscar subscription', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute('invalid-user-id')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.findById).toHaveBeenCalledWith('invalid-user-id');
      expect(prismaService.subscription.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('Comportamento: Diferentes tipos de usuários', () => {
    it('deve validar sessão de usuário ADMIN', async () => {
      // Arrange
      const adminUser = new User(
        {
          email: 'admin@example.com',
          password: 'hashed-password',
          fullName: 'Admin User',
          role: UserRole.ADMIN,
        },
        'admin-id',
      );

      userRepository.findById.mockResolvedValue(adminUser);
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await useCase.execute('admin-id');

      // Assert
      expect(result.user.role).toBe(UserRole.ADMIN);
      expect(result.user.id).toBe('admin-id');
    });

    it('deve validar sessão de usuário com conta OAuth', async () => {
      // Arrange
      const oauthUser = new User(
        {
          email: 'oauth@example.com',
          googleId: 'google-123',
          githubId: 'github-456',
          fullName: 'OAuth User',
          avatarUrl: 'https://oauth-avatar.url',
          role: UserRole.USER,
        },
        'oauth-user-id',
      );

      userRepository.findById.mockResolvedValue(oauthUser);
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'PRO',
      });

      // Act
      const result = await useCase.execute('oauth-user-id');

      // Assert
      expect(result.user.id).toBe('oauth-user-id');
      expect(result.user.email).toBe('oauth@example.com');
      expect(result.user.plan).toBe('PRO');
    });
  });

  describe('Comportamento: Estrutura de resposta', () => {
    it('deve retornar apenas campos necessários', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'PRO',
      });

      // Act
      const result = await useCase.execute('user-id-123');

      // Assert: não deve retornar password ou dados sensíveis
      expect(result.user).not.toHaveProperty('password');
      expect(result.user).not.toHaveProperty('googleId');
      expect(result.user).not.toHaveProperty('githubId');
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('email');
      expect(result.user).toHaveProperty('role');
      expect(result.user).toHaveProperty('plan');
      expect(result.user).toHaveProperty('user_metadata');
    });

    it('deve retornar user_metadata vazio quando usuário não tem dados', async () => {
      // Arrange
      const minimalUser = new User(
        {
          email: 'minimal@example.com',
          password: 'password',
          role: UserRole.USER,
        },
        'minimal-id',
      );

      userRepository.findById.mockResolvedValue(minimalUser);
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await useCase.execute('minimal-id');

      // Assert
      expect(result.user.user_metadata.full_name).toBeUndefined();
      expect(result.user.user_metadata.avatar_url).toBeUndefined();
    });
  });
});
