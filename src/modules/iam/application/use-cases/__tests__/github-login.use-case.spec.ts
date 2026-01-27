import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { GitHubLoginUseCase } from '../github-login.use-case';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { PrismaService } from '../../../../prisma/prisma.service';
import { User, UserRole } from '../../../domain/entities/user.entity';

describe('GitHubLoginUseCase', () => {
  let useCase: GitHubLoginUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let prismaService: jest.Mocked<PrismaService>;

  const mockGitHubPayload = {
    id: '12345',
    login: 'testuser',
    email: 'test@github.com',
    name: 'Test User',
    avatar_url: 'https://avatar.url',
  };

  const mockUser = new User(
    {
      email: 'test@github.com',
      githubId: '12345',
      fullName: 'Test User',
      avatarUrl: 'https://avatar.url',
      role: UserRole.USER,
    },
    'user-id-123',
  );

  beforeEach(async () => {
    const mockUserRepository = {
      findByGithubId: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      decode: jest.fn(),
    };

    const mockPrismaService = {
      subscription: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GitHubLoginUseCase,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    useCase = module.get<GitHubLoginUseCase>(GitHubLoginUseCase);
    userRepository = module.get('UserRepository');
    jwtService = module.get(JwtService);
    prismaService = module.get(PrismaService);
  });

  describe('Comportamento: Login com GitHub token válido', () => {
    it('deve fazer login de usuário existente via GitHub ID', async () => {
      // Arrange: usuário já existe com GitHub vinculado
      userRepository.findByGithubId.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('jwt-token-123');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'PRO',
      });

      // Mock da verificação do GitHub token
      jest.spyOn(useCase as any, 'verifyGitHubToken').mockResolvedValue(mockGitHubPayload);

      // Act
      const result = await useCase.execute({ github_token: 'valid-github-token' });

      // Assert: retorna usuário e token
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token', 'jwt-token-123');
      expect(result.user.email).toBe('test@github.com');
      expect(result.user.plan).toBe('PRO');
      expect(userRepository.findByGithubId).toHaveBeenCalledWith('12345');
    });

    it('deve vincular GitHub a conta existente por email', async () => {
      // Arrange: usuário existe mas sem GitHub vinculado
      const existingUser = new User(
        {
          email: 'test@github.com',
          password: 'hashed-password',
          fullName: 'Existing User',
          role: UserRole.USER,
        },
        'existing-user-id',
      );

      userRepository.findByGithubId.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(existingUser);
      userRepository.save.mockResolvedValue(undefined);
      jwtService.sign.mockReturnValue('jwt-token-456');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'FREE',
      });

      jest.spyOn(useCase as any, 'verifyGitHubToken').mockResolvedValue(mockGitHubPayload);

      // Act
      const result = await useCase.execute({ github_token: 'valid-github-token' });

      // Assert: vincula GitHub ao usuário existente
      expect(userRepository.save).toHaveBeenCalled();
      const savedUser = userRepository.save.mock.calls[0][0];
      expect(savedUser.githubId).toBe('12345');
      expect(savedUser.email).toBe('test@github.com');
      expect(result.token).toBe('jwt-token-456');
    });

    it('deve criar novo usuário se não existir', async () => {
      // Arrange: usuário não existe
      userRepository.findByGithubId.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(undefined);
      jwtService.sign.mockReturnValue('jwt-token-new');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(null);

      jest.spyOn(useCase as any, 'verifyGitHubToken').mockResolvedValue(mockGitHubPayload);

      // Act
      const result = await useCase.execute({ github_token: 'valid-github-token' });

      // Assert: cria novo usuário
      expect(userRepository.save).toHaveBeenCalled();
      const savedUser = userRepository.save.mock.calls[0][0];
      expect(savedUser.email).toBe('test@github.com');
      expect(savedUser.githubId).toBe('12345');
      expect(savedUser.role).toBe(UserRole.USER);
      expect(result.user.plan).toBe('FREE');
    });
  });

  describe('Comportamento: Validação de token', () => {
    it('deve lançar UnauthorizedException com token inválido', async () => {
      // Arrange: token GitHub inválido
      jest.spyOn(useCase as any, 'verifyGitHubToken').mockResolvedValue(null);

      // Act & Assert
      await expect(
        useCase.execute({ github_token: 'invalid-token' }),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        useCase.execute({ github_token: 'invalid-token' }),
      ).rejects.toThrow('Invalid GitHub token');
    });

    it('deve preservar dados do usuário ao vincular GitHub', async () => {
      // Arrange: usuário com dados existentes
      const existingUser = new User(
        {
          email: 'test@github.com',
          password: 'existing-password',
          fullName: 'Original Name',
          avatarUrl: 'https://original-avatar.url',
          role: UserRole.ADMIN,
        },
        'admin-user-id',
      );

      userRepository.findByGithubId.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(existingUser);
      userRepository.save.mockResolvedValue(undefined);
      jwtService.sign.mockReturnValue('jwt-token');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'CUSTOM',
      });

      jest.spyOn(useCase as any, 'verifyGitHubToken').mockResolvedValue(mockGitHubPayload);

      // Act
      await useCase.execute({ github_token: 'valid-token' });

      // Assert: mantém dados originais (password, role) e adiciona GitHub
      const savedUser = userRepository.save.mock.calls[0][0];
      expect(savedUser.password).toBe('existing-password');
      expect(savedUser.role).toBe(UserRole.ADMIN);
      expect(savedUser.githubId).toBe('12345');
      expect(savedUser.fullName).toBe('Original Name'); // Mantém nome original
    });
  });

  describe('Comportamento: Geração de JWT', () => {
    it('deve gerar token JWT com claims corretos', async () => {
      // Arrange
      userRepository.findByGithubId.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('generated-jwt');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(null);

      jest.spyOn(useCase as any, 'verifyGitHubToken').mockResolvedValue(mockGitHubPayload);

      // Act
      await useCase.execute({ github_token: 'valid-token' });

      // Assert: JWT contém sub, email e role
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });
  });

  describe('Comportamento: Integração com Subscription', () => {
    it('deve retornar plano FREE quando não há subscription', async () => {
      // Arrange
      userRepository.findByGithubId.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('jwt-token');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(null);

      jest.spyOn(useCase as any, 'verifyGitHubToken').mockResolvedValue(mockGitHubPayload);

      // Act
      const result = await useCase.execute({ github_token: 'valid-token' });

      // Assert
      expect(result.user.plan).toBe('FREE');
    });

    it('deve retornar plano correto quando há subscription', async () => {
      // Arrange
      userRepository.findByGithubId.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('jwt-token');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'PRO',
        user_id: mockUser.id,
      });

      jest.spyOn(useCase as any, 'verifyGitHubToken').mockResolvedValue(mockGitHubPayload);

      // Act
      const result = await useCase.execute({ github_token: 'valid-token' });

      // Assert
      expect(result.user.plan).toBe('PRO');
      expect(prismaService.subscription.findUnique).toHaveBeenCalledWith({
        where: { user_id: mockUser.id },
      });
    });
  });
});
