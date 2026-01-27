import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { GoogleLoginUseCase } from '../google-login.use-case';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { PrismaService } from '../../../../prisma/prisma.service';
import { User, UserRole } from '../../../domain/entities/user.entity';

describe('GoogleLoginUseCase', () => {
  let useCase: GoogleLoginUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let prismaService: jest.Mocked<PrismaService>;

  const mockGooglePayload = {
    sub: 'google-id-12345',
    email: 'test@gmail.com',
    name: 'Test User',
    picture: 'https://google-avatar.url',
  };

  const mockUser = new User(
    {
      email: 'test@gmail.com',
      googleId: 'google-id-12345',
      fullName: 'Test User',
      avatarUrl: 'https://google-avatar.url',
      role: UserRole.USER,
    },
    'user-id-123',
  );

  beforeEach(async () => {
    const mockUserRepository = {
      findByGoogleId: jest.fn(),
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
        GoogleLoginUseCase,
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

    useCase = module.get<GoogleLoginUseCase>(GoogleLoginUseCase);
    userRepository = module.get('UserRepository');
    jwtService = module.get(JwtService);
    prismaService = module.get(PrismaService);
  });

  describe('Comportamento: Login com Google token válido', () => {
    it('deve fazer login de usuário existente via Google ID', async () => {
      // Arrange: usuário já existe com Google vinculado
      userRepository.findByGoogleId.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('jwt-token-123');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'PRO',
      });

      // Mock da verificação do Google token
      jest.spyOn(useCase as any, 'verifyGoogleToken').mockResolvedValue(mockGooglePayload);

      // Act
      const result = await useCase.execute({ google_token: 'valid-google-token' });

      // Assert: retorna usuário e token
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token', 'jwt-token-123');
      expect(result.user.email).toBe('test@gmail.com');
      expect(result.user.plan).toBe('PRO');
      expect(userRepository.findByGoogleId).toHaveBeenCalledWith('google-id-12345');
    });

    it('deve vincular Google a conta existente por email', async () => {
      // Arrange: usuário existe mas sem Google vinculado
      const existingUser = new User(
        {
          email: 'test@gmail.com',
          password: 'hashed-password',
          fullName: 'Existing User',
          role: UserRole.USER,
        },
        'existing-user-id',
      );

      userRepository.findByGoogleId.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(existingUser);
      userRepository.save.mockResolvedValue(undefined);
      jwtService.sign.mockReturnValue('jwt-token-456');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'FREE',
      });

      jest.spyOn(useCase as any, 'verifyGoogleToken').mockResolvedValue(mockGooglePayload);

      // Act
      const result = await useCase.execute({ google_token: 'valid-google-token' });

      // Assert: vincula Google ao usuário existente
      expect(userRepository.save).toHaveBeenCalled();
      const savedUser = userRepository.save.mock.calls[0][0];
      expect(savedUser.googleId).toBe('google-id-12345');
      expect(savedUser.email).toBe('test@gmail.com');
      expect(result.token).toBe('jwt-token-456');
    });

    it('deve criar novo usuário se não existir', async () => {
      // Arrange: usuário não existe
      userRepository.findByGoogleId.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.save.mockResolvedValue(undefined);
      jwtService.sign.mockReturnValue('jwt-token-new');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(null);

      jest.spyOn(useCase as any, 'verifyGoogleToken').mockResolvedValue(mockGooglePayload);

      // Act
      const result = await useCase.execute({ google_token: 'valid-google-token' });

      // Assert: cria novo usuário
      expect(userRepository.save).toHaveBeenCalled();
      const savedUser = userRepository.save.mock.calls[0][0];
      expect(savedUser.email).toBe('test@gmail.com');
      expect(savedUser.googleId).toBe('google-id-12345');
      expect(savedUser.role).toBe(UserRole.USER);
      expect(result.user.plan).toBe('FREE');
    });
  });

  describe('Comportamento: Validação de token', () => {
    it('deve lançar UnauthorizedException com token inválido', async () => {
      // Arrange: token Google inválido
      jest.spyOn(useCase as any, 'verifyGoogleToken').mockResolvedValue(null);

      // Act & Assert
      await expect(
        useCase.execute({ google_token: 'invalid-token' }),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        useCase.execute({ google_token: 'invalid-token' }),
      ).rejects.toThrow('Invalid Google token');
    });

    it('deve preservar dados do usuário ao vincular Google', async () => {
      // Arrange: usuário com dados existentes
      const existingUser = new User(
        {
          email: 'test@gmail.com',
          password: 'existing-password',
          fullName: 'Original Name',
          avatarUrl: 'https://original-avatar.url',
          role: UserRole.ADMIN,
        },
        'admin-user-id',
      );

      userRepository.findByGoogleId.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(existingUser);
      userRepository.save.mockResolvedValue(undefined);
      jwtService.sign.mockReturnValue('jwt-token');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'CUSTOM',
      });

      jest.spyOn(useCase as any, 'verifyGoogleToken').mockResolvedValue(mockGooglePayload);

      // Act
      await useCase.execute({ google_token: 'valid-token' });

      // Assert: mantém dados originais (password, role) e adiciona Google
      const savedUser = userRepository.save.mock.calls[0][0];
      expect(savedUser.password).toBe('existing-password');
      expect(savedUser.role).toBe(UserRole.ADMIN);
      expect(savedUser.googleId).toBe('google-id-12345');
      expect(savedUser.fullName).toBe('Original Name'); // Mantém nome original
    });

    it('deve usar dados do Google quando usuário não tem fullName', async () => {
      // Arrange: usuário sem nome completo
      const existingUser = new User(
        {
          email: 'test@gmail.com',
          password: 'password',
          role: UserRole.USER,
        },
        'user-id',
      );

      userRepository.findByGoogleId.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(existingUser);
      userRepository.save.mockResolvedValue(undefined);
      jwtService.sign.mockReturnValue('jwt-token');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(null);

      jest.spyOn(useCase as any, 'verifyGoogleToken').mockResolvedValue(mockGooglePayload);

      // Act
      await useCase.execute({ google_token: 'valid-token' });

      // Assert: usa nome do Google
      const savedUser = userRepository.save.mock.calls[0][0];
      expect(savedUser.fullName).toBe('Test User');
      expect(savedUser.avatarUrl).toBe('https://google-avatar.url');
    });
  });

  describe('Comportamento: Geração de JWT', () => {
    it('deve gerar token JWT com claims corretos', async () => {
      // Arrange
      userRepository.findByGoogleId.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('generated-jwt');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(null);

      jest.spyOn(useCase as any, 'verifyGoogleToken').mockResolvedValue(mockGooglePayload);

      // Act
      await useCase.execute({ google_token: 'valid-token' });

      // Assert: JWT contém sub, email e role
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });
  });

  describe('Comportamento: Estrutura de resposta', () => {
    it('deve retornar estrutura correta com user_metadata', async () => {
      // Arrange
      userRepository.findByGoogleId.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('jwt-token');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'PRO',
      });

      jest.spyOn(useCase as any, 'verifyGoogleToken').mockResolvedValue(mockGooglePayload);

      // Act
      const result = await useCase.execute({ google_token: 'valid-token' });

      // Assert: estrutura específica do Google login
      expect(result.user).toHaveProperty('user_metadata');
      expect(result.user.user_metadata).toHaveProperty('full_name', mockUser.fullName);
      expect(result.user.user_metadata).toHaveProperty('avatar_url', mockUser.avatarUrl);
      expect(result.user).not.toHaveProperty('full_name'); // Não deve estar no nível raiz
    });
  });

  describe('Comportamento: Integração com Subscription', () => {
    it('deve retornar plano FREE quando não há subscription', async () => {
      // Arrange
      userRepository.findByGoogleId.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('jwt-token');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue(null);

      jest.spyOn(useCase as any, 'verifyGoogleToken').mockResolvedValue(mockGooglePayload);

      // Act
      const result = await useCase.execute({ google_token: 'valid-token' });

      // Assert
      expect(result.user.plan).toBe('FREE');
    });

    it('deve retornar plano correto quando há subscription', async () => {
      // Arrange
      userRepository.findByGoogleId.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('jwt-token');
      (prismaService.subscription.findUnique as jest.Mock).mockResolvedValue({
        plan: 'CUSTOM',
        user_id: mockUser.id,
      });

      jest.spyOn(useCase as any, 'verifyGoogleToken').mockResolvedValue(mockGooglePayload);

      // Act
      const result = await useCase.execute({ google_token: 'valid-token' });

      // Assert
      expect(result.user.plan).toBe('CUSTOM');
      expect(prismaService.subscription.findUnique).toHaveBeenCalledWith({
        where: { user_id: mockUser.id },
      });
    });
  });
});
