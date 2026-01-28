import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AgentRepository } from '../../domain/repositories/agent.repository.interface';
import { Agent, AgentVisibility } from '../../domain/entities/agent.entity';

export interface CreateAgentInput {
  user_id: string;
  user_role?: string;
  user_plan?: string;
  llmId?: string;
  name: string;
  avatar?: string;
  description?: string;
  prompt?: string;
  category?: string;
  type?: string;
  tone?: string;
  style?: string;
  focus?: string;
  rules?: string;
  visibility?: AgentVisibility;
}

@Injectable()
export class CreateAgentUseCase {
  constructor(
    @Inject('AgentRepository')
    private readonly agentRepository: AgentRepository,
  ) {}

  async execute(input: CreateAgentInput) {
    const isAdmin = ['ADMIN', 'MODERATOR', 'OWNER'].includes(input.user_role || '');
    const isPremium = ['PRO', 'CUSTOM'].includes(input.user_plan || '');
    
    // Validar que apenas usuários pagantes ou admins podem criar agentes
    if (!isPremium && !isAdmin) {
      throw new ForbiddenException('Apenas usuários com plano PRO ou CUSTOM podem criar agentes');
    }
    
    // Validar que apenas admins podem criar agentes com visibilidade diferente de PRIVATE
    if (input.visibility && input.visibility !== AgentVisibility.PRIVATE && !isAdmin) {
      throw new ForbiddenException('Apenas administradores podem criar agentes públicos ou com visibilidade específica por plano');
    }

    // Se não for admin, forçar visibilidade PRIVATE
    const visibility = isAdmin ? (input.visibility || AgentVisibility.PRIVATE) : AgentVisibility.PRIVATE;

    const agent = new Agent({
      userId: input.user_id,
      llmId: input.llmId,
      name: input.name,
      avatar: input.avatar,
      description: input.description,
      prompt: input.prompt,
      category: input.category,
      type: input.type,
      tone: input.tone,
      style: input.style,
      focus: input.focus,
      rules: input.rules,
      visibility,
    });

    await this.agentRepository.save(agent);

    return {
      id: agent.id,
      user_id: agent.userId,
      name: agent.name,
      avatar: agent.avatar,
      description: agent.description,
      prompt: agent.prompt,
      category: agent.category,
      type: agent.type,
      tone: agent.tone,
      style: agent.style,
      focus: agent.focus,
      rules: agent.rules,
      visibility: agent.visibility,
      created_at: agent.props.createdAt || new Date(),
    };
  }
}

export interface UpdateAgentInput {
  user_role?: string;
  llmId?: string;
  name?: string;
  avatar?: string;
  description?: string;
  prompt?: string;
  category?: string;
  type?: string;
  tone?: string;
  style?: string;
  focus?: string;
  rules?: string;
  visibility?: AgentVisibility;
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

    const isAdmin = ['ADMIN', 'MODERATOR', 'OWNER'].includes(input.user_role || '');
    
    // Validar que apenas admins podem alterar visibilidade para algo diferente de PRIVATE
    if (input.visibility && input.visibility !== AgentVisibility.PRIVATE && !isAdmin) {
      throw new ForbiddenException('Apenas administradores podem alterar a visibilidade para pública ou específica por plano');
    }

    const updatedAgent = new Agent(
      {
        ...agent.props,
        llmId: input.llmId ?? agent.llmId,
        name: input.name ?? agent.name,
        avatar: input.avatar ?? agent.avatar,
        description: input.description ?? agent.description,
        prompt: input.prompt ?? agent.prompt,
        category: input.category ?? agent.category,
        type: input.type ?? agent.type,
        tone: input.tone ?? agent.tone,
        style: input.style ?? agent.style,
        focus: input.focus ?? agent.focus,
        rules: input.rules ?? agent.rules,
        visibility: input.visibility ?? agent.visibility,
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
        prompt: updatedAgent.prompt,
        category: updatedAgent.category,
        type: updatedAgent.type,
        tone: updatedAgent.tone,
        style: updatedAgent.style,
        focus: updatedAgent.focus,
        rules: updatedAgent.rules,
        visibility: updatedAgent.visibility,
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

  async execute(userId: string, userRole: string, userPlan: string) {
    const agents = await this.agentRepository.findAccessibleByUser(userId, userRole, userPlan);
    return agents.map((a) => ({
      id: a.id,
      user_id: a.userId,
      name: a.name,
      avatar: a.avatar,
      description: a.description,
      prompt: a.prompt,
      category: a.category,
      type: a.type,
      tone: a.tone,
      style: a.style,
      focus: a.focus,
      rules: a.rules,
      visibility: a.visibility,
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
