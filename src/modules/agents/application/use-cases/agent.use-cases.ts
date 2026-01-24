import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AgentRepository } from '../../domain/repositories/agent.repository.interface';
import { Agent } from '../../domain/entities/agent.entity';

export interface CreateAgentInput {
  user_id: string;
  name: string;
  avatar?: string;
  description?: string;
}

@Injectable()
export class CreateAgentUseCase {
  constructor(
    @Inject('AgentRepository')
    private readonly agentRepository: AgentRepository,
  ) {}

  async execute(input: CreateAgentInput) {
    const agent = new Agent({
      userId: input.user_id,
      name: input.name,
      avatar: input.avatar,
      description: input.description,
    });

    await this.agentRepository.save(agent);

    return {
      id: agent.id,
      user_id: agent.userId,
      name: agent.name,
      avatar: agent.avatar,
      description: agent.description,
      created_at: agent.props.createdAt || new Date(),
    };
  }
}

export interface UpdateAgentInput {
  name?: string;
  avatar?: string;
  description?: string;
}

@Injectable()
export class UpdateAgentUseCase {
  constructor(
    @Inject('AgentRepository')
    private readonly agentRepository: AgentRepository,
  ) {}

  async execute(agentId: string, input: UpdateAgentInput) {
    const agent = await this.agentRepository.findById(agentId);
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const updatedAgent = new Agent(
      {
        ...agent.props,
        name: input.name ?? agent.name,
        avatar: input.avatar ?? agent.avatar,
        description: input.description ?? agent.description,
      },
      agent.id,
    );

    await this.agentRepository.save(updatedAgent);

    return {
      agent: {
        id: updatedAgent.id,
        user_id: updatedAgent.userId,
        name: updatedAgent.name,
        avatar: updatedAgent.avatar,
        description: updatedAgent.description,
        created_at: updatedAgent.props.createdAt,
        updated_at: new Date(),
      },
      success: true,
    };
  }
}

@Injectable()
export class ListAgentsUseCase {
  constructor(
    @Inject('AgentRepository')
    private readonly agentRepository: AgentRepository,
  ) {}

  async execute(userId: string) {
    const agents = await this.agentRepository.findByUserId(userId);
    return agents.map((a) => ({
      id: a.id,
      user_id: a.userId,
      name: a.name,
      avatar: a.avatar,
      description: a.description,
      created_at: a.props.createdAt,
      updated_at: a.props.updatedAt,
    }));
  }
}

@Injectable()
export class DeleteAgentUseCase {
  constructor(
    @Inject('AgentRepository')
    private readonly agentRepository: AgentRepository,
  ) {}

  async execute(id: string) {
    const agent = await this.agentRepository.findById(id);
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    await this.agentRepository.delete(id);
  }
}
