import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetProfileUseCase, UpdateProfileUseCase } from '../profile.use-cases';
import { UserRepository } from '../../../domain/repositories/user.repository.interface';
import { User, UserRole } from '../../../domain/entities/user.entity';

describe('GetProfileUseCase', () => {
  let useCase: GetProfileUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser = new User(
    {
      email: 'test@example.com',
      password: 'hashed-password',
      fullName: 'Test User',
      avatarUrl: 'https://avatar.url/photo.jpg',
      role: UserRole.USER,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-15'),
    },
    'user-id-123',
  );

  beforeEach(async () => {
    const mockUserRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProfileUseCase,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetProfileUseCase>(GetProfileUseCase);
    userRepository = module.get('UserRepository');
  });

  describe('Comportamento: Buscar perfil existente', () => {
    it('deve retornar perfil completo do usuário', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await useCase.execute('user-id-123');

      // Assert
      expect(result).toHaveProperty('id', 'user-id-123');
      expect(result).toHaveProperty('user_id', 'user-id-123');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).toHaveProperty('full_name', 'Test User');
      expect(result).toHaveProperty('avatar_url', 'https://avatar.url/photo.jpg');
      expect(result).toHaveProperty('created_at');
      expect(result).toHaveProperty('updated_at');
      expect(userRepository.findById).toHaveBeenCalledWith('user-id-123');
    });

    it('deve retornar timestamps corretos', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await useCase.execute('user-id-123');

      // Assert
      expect(result.created_at).toEqual(new Date('2025-01-01'));
      expect(result.updated_at).toEqual(new Date('2025-01-15'));
    });

    it('deve retornar perfil mesmo sem avatar', async () => {
      // Arrange: usuário sem avatar
      const userWithoutAvatar = new User(
        {
          email: 'noavatar@example.com',
          password: 'password',
          fullName: 'User No Avatar',
          role: UserRole.USER,
        },
        'user-id-no-avatar',
      );

      userRepository.findById.mockResolvedValue(userWithoutAvatar);

      // Act
      const result = await useCase.execute('user-id-no-avatar');

      // Assert
      expect(result.avatar_url).toBeUndefined();
      expect(result.full_name).toBe('User No Avatar');
    });

    it('deve retornar perfil de usuário ADMIN', async () => {
      // Arrange
      const adminUser = new User(
        {
          email: 'admin@example.com',
          password: 'password',
          fullName: 'Admin User',
          role: UserRole.ADMIN,
        },
        'admin-id',
      );

      userRepository.findById.mockResolvedValue(adminUser);

      // Act
      const result = await useCase.execute('admin-id');

      // Assert
      expect(result.id).toBe('admin-id');
      expect(result.email).toBe('admin@example.com');
    });
  });

  describe('Comportamento: Perfil inexistente', () => {
    it('deve lançar NotFoundException quando usuário não existe', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(useCase.execute('non-existent-id')).rejects.toThrow(
        'Profile not found',
      );
    });

    it('deve verificar ID antes de retornar dados', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute('invalid-id')).rejects.toThrow();
      expect(userRepository.findById).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('Comportamento: Estrutura de resposta', () => {
    it('deve incluir id e user_id (ambos iguais)', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await useCase.execute('user-id-123');

      // Assert: id e user_id devem ser iguais para compatibilidade
      expect(result.id).toBe(result.user_id);
      expect(result.id).toBe('user-id-123');
    });

    it('não deve retornar dados sensíveis', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await useCase.execute('user-id-123');

      // Assert: não deve conter password, googleId, githubId, role
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('googleId');
      expect(result).not.toHaveProperty('githubId');
      expect(result).not.toHaveProperty('role');
    });
  });
});

describe('UpdateProfileUseCase', () => {
  let useCase: UpdateProfileUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser = new User(
    {
      email: 'test@example.com',
      password: 'hashed-password',
      fullName: 'Original Name',
      avatarUrl: 'https://old-avatar.url',
      role: UserRole.USER,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-15'),
    },
    'user-id-123',
  );

  beforeEach(async () => {
    const mockUserRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProfileUseCase,
        {
          provide: 'UserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateProfileUseCase>(UpdateProfileUseCase);
    userRepository = module.get('UserRepository');
  });

  describe('Comportamento: Atualizar nome completo', () => {
    it('deve atualizar apenas full_name', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute('user-id-123', {
        full_name: 'Updated Name',
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.profile.full_name).toBe('Updated Name');
      expect(result.profile.avatar_url).toBe('https://old-avatar.url'); // Mantém avatar original
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('deve preservar outros campos ao atualizar nome', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(undefined);

      // Act
      await useCase.execute('user-id-123', {
        full_name: 'New Name',
      });

      // Assert
      const savedUser = userRepository.save.mock.calls[0][0];
      expect(savedUser.email).toBe('test@example.com');
      expect(savedUser.password).toBe('hashed-password');
      expect(savedUser.role).toBe(UserRole.USER);
      expect(savedUser.fullName).toBe('New Name');
    });
  });

  describe('Comportamento: Atualizar avatar', () => {
    it('deve atualizar apenas avatar_url', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute('user-id-123', {
        avatar_url: 'https://new-avatar.url/photo.jpg',
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.profile.avatar_url).toBe('https://new-avatar.url/photo.jpg');
      expect(result.profile.full_name).toBe('Original Name'); // Mantém nome original
    });

    it('deve permitir remover avatar (null/undefined)', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute('user-id-123', {
        avatar_url: undefined,
      });

      // Assert: mantém avatar original quando undefined
      expect(result.profile.avatar_url).toBe('https://old-avatar.url');
    });
  });

  describe('Comportamento: Atualizar múltiplos campos', () => {
    it('deve atualizar nome e avatar simultaneamente', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute('user-id-123', {
        full_name: 'Complete Update',
        avatar_url: 'https://completely-new-avatar.url',
      });

      // Assert
      expect(result.success).toBe(true);
      expect(result.profile.full_name).toBe('Complete Update');
      expect(result.profile.avatar_url).toBe('https://completely-new-avatar.url');
    });

    it('deve salvar usuário com todos os campos atualizados', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(undefined);

      // Act
      await useCase.execute('user-id-123', {
        full_name: 'Both Updated',
        avatar_url: 'https://both-avatar.url',
      });

      // Assert
      const savedUser = userRepository.save.mock.calls[0][0];
      expect(savedUser.fullName).toBe('Both Updated');
      expect(savedUser.avatarUrl).toBe('https://both-avatar.url');
      expect(savedUser.id).toBe('user-id-123');
    });
  });

  describe('Comportamento: Atualização sem mudanças', () => {
    it('deve permitir atualização vazia (sem campos)', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute('user-id-123', {});

      // Assert: mantém valores originais
      expect(result.success).toBe(true);
      expect(result.profile.full_name).toBe('Original Name');
      expect(result.profile.avatar_url).toBe('https://old-avatar.url');
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  describe('Comportamento: Perfil inexistente', () => {
    it('deve lançar NotFoundException quando usuário não existe', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        useCase.execute('non-existent-id', { full_name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        useCase.execute('non-existent-id', { full_name: 'Test' }),
      ).rejects.toThrow('Profile not found');
    });

    it('não deve tentar salvar se usuário não existe', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        useCase.execute('invalid-id', { full_name: 'Test' }),
      ).rejects.toThrow();
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('Comportamento: Estrutura de resposta', () => {
    it('deve retornar success=true e profile completo', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute('user-id-123', {
        full_name: 'Updated',
      });

      // Assert
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('profile');
      expect(result.profile).toHaveProperty('id');
      expect(result.profile).toHaveProperty('user_id');
      expect(result.profile).toHaveProperty('email');
      expect(result.profile).toHaveProperty('full_name');
      expect(result.profile).toHaveProperty('avatar_url');
      expect(result.profile).toHaveProperty('created_at');
      expect(result.profile).toHaveProperty('updated_at');
    });

    it('deve incluir id e user_id iguais na resposta', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute('user-id-123', {});

      // Assert
      expect(result.profile.id).toBe(result.profile.user_id);
      expect(result.profile.id).toBe('user-id-123');
    });

    it('deve atualizar timestamp updated_at', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(undefined);
      const beforeUpdate = new Date();

      // Act
      const result = await useCase.execute('user-id-123', {
        full_name: 'Updated',
      });

      // Assert: updated_at deve ser recente
      expect(result.profile.updated_at.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime() - 1000,
      );
      expect(result.profile.created_at).toEqual(new Date('2025-01-01')); // created_at não muda
    });

    it('não deve retornar dados sensíveis', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await useCase.execute('user-id-123', {});

      // Assert
      expect(result.profile).not.toHaveProperty('password');
      expect(result.profile).not.toHaveProperty('googleId');
      expect(result.profile).not.toHaveProperty('githubId');
      expect(result.profile).not.toHaveProperty('role');
    });
  });

  describe('Comportamento: Preservação de dados', () => {
    it('deve preservar dados OAuth ao atualizar perfil', async () => {
      // Arrange: usuário com OAuth
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
      userRepository.save.mockResolvedValue(undefined);

      // Act
      await useCase.execute('oauth-user-id', {
        full_name: 'Updated OAuth User',
      });

      // Assert: mantém googleId e githubId
      const savedUser = userRepository.save.mock.calls[0][0];
      expect(savedUser.googleId).toBe('google-123');
      expect(savedUser.githubId).toBe('github-456');
      expect(savedUser.fullName).toBe('Updated OAuth User');
    });

    it('deve preservar role ao atualizar perfil', async () => {
      // Arrange: usuário ADMIN
      const adminUser = new User(
        {
          email: 'admin@example.com',
          password: 'password',
          fullName: 'Admin',
          role: UserRole.ADMIN,
        },
        'admin-id',
      );

      userRepository.findById.mockResolvedValue(adminUser);
      userRepository.save.mockResolvedValue(undefined);

      // Act
      await useCase.execute('admin-id', {
        avatar_url: 'https://new-admin-avatar.url',
      });

      // Assert: mantém role ADMIN
      const savedUser = userRepository.save.mock.calls[0][0];
      expect(savedUser.role).toBe(UserRole.ADMIN);
    });
  });
});
