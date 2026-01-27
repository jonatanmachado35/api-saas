import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import {
  CreateAgentUseCase,
  UpdateAgentUseCase,
  ListAgentsUseCase,
  DeleteAgentUseCase,
} from '../agent.use-cases';
import { AgentRepository } from '../../../domain/repositories/agent.repository.interface';
import { Agent } from '../../../domain/entities/agent.entity';

describe('Agent Use Cases', () => {
  let createUseCase: CreateAgentUseCase;
  let updateUseCase: UpdateAgentUseCase;
  let listUseCase: ListAgentsUseCase;
  let deleteUseCase: DeleteAgentUseCase;
  let agentRepository: jest.Mocked<AgentRepository>;

  const mockAgent = new Agent(
    {
      userId: 'user-id-123',
      name: 'Test Agent',
      avatar: '🤖',
      description: 'Test description',
    },
    'agent-id-123',
  );

  beforeEach(async () => {
    const mockAgentRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findAccessibleByUser: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAgentUseCase,
        UpdateAgentUseCase,
        ListAgentsUseCase,
        DeleteAgentUseCase,
        { provide: 'AgentRepository', useValue: mockAgentRepository },
      ],
    }).compile();

    createUseCase = module.get<CreateAgentUseCase>(CreateAgentUseCase);
    updateUseCase = module.get<UpdateAgentUseCase>(UpdateAgentUseCase);
    listUseCase = module.get<ListAgentsUseCase>(ListAgentsUseCase);
    deleteUseCase = module.get<DeleteAgentUseCase>(DeleteAgentUseCase);
    agentRepository = module.get('AgentRepository');
  });

  describe('CreateAgentUseCase', () => {
    it('should be defined', () => {
      expect(createUseCase).toBeDefined();
    });

    it('should create an agent successfully', async () => {
      const input = {
        user_id: 'user-id-123',
        user_role: 'USER',
        user_plan: 'PRO',
        name: 'New Agent',
        avatar: '🧠',
        description: 'New description',
      };

      agentRepository.save.mockResolvedValue();

      const result = await createUseCase.execute(input);

      expect(agentRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', input.name);
      expect(result).toHaveProperty('user_id', input.user_id);
    });
  });

  describe('UpdateAgentUseCase', () => {
    it('should be defined', () => {
      expect(updateUseCase).toBeDefined();
    });

    it('should update an agent successfully', async () => {
      const input = {
        name: 'Updated Name',
        avatar: '🎯',
      };

      agentRepository.findById.mockResolvedValue(mockAgent);
      agentRepository.save.mockResolvedValue();

      const result = await updateUseCase.execute('agent-id-123', input);

      expect(agentRepository.findById).toHaveBeenCalledWith('agent-id-123');
      expect(agentRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('success', true);
      expect(result.agent).toHaveProperty('name', input.name);
    });

    it('should throw NotFoundException if agent not found', async () => {
      agentRepository.findById.mockResolvedValue(null);

      await expect(
        updateUseCase.execute('non-existent-id', { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('ListAgentsUseCase', () => {
    it('should be defined', () => {
      expect(listUseCase).toBeDefined();
    });

    it('should list agents for a user', async () => {
      agentRepository.findAccessibleByUser.mockResolvedValue([mockAgent]);

      const result = await listUseCase.execute('user-id-123', 'USER', 'FREE');

      expect(agentRepository.findAccessibleByUser).toHaveBeenCalledWith('user-id-123', 'USER', 'FREE');
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', mockAgent.id);
    });

    it('should return empty array if no agents found', async () => {
      agentRepository.findAccessibleByUser.mockResolvedValue([]);

      const result = await listUseCase.execute('user-id-123', 'USER', 'FREE');

      expect(result).toHaveLength(0);
    });
  });

  describe('DeleteAgentUseCase', () => {
    it('should be defined', () => {
      expect(deleteUseCase).toBeDefined();
    });

    it('should delete an agent successfully', async () => {
      agentRepository.findById.mockResolvedValue(mockAgent);
      agentRepository.delete.mockResolvedValue();

      await deleteUseCase.execute('agent-id-123');

      expect(agentRepository.findById).toHaveBeenCalledWith('agent-id-123');
      expect(agentRepository.delete).toHaveBeenCalledWith('agent-id-123');
    });

    it('should throw NotFoundException if agent not found', async () => {
      agentRepository.findById.mockResolvedValue(null);

      await expect(deleteUseCase.execute('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(agentRepository.delete).not.toHaveBeenCalled();
    });
  });
});
