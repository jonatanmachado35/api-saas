import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Agent } from '../../domain/entities/agent.entity';
import { AgentRepository } from '../../domain/repositories/agent.repository.interface';

@Injectable()
export class PrismaAgentRepository implements AgentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(agent: any): Agent {
    return new Agent(
      {
        userId: agent.user_id,
        name: agent.name,
        avatar: agent.avatar,
        description: agent.description,
        createdAt: agent.created_at,
        updatedAt: agent.updated_at,
      },
      agent.id,
    );
  }

  async save(agent: Agent): Promise<void> {
    const data = {
      id: agent.id,
      user_id: agent.userId,
      name: agent.name,
      avatar: agent.avatar,
      description: agent.description,
    };

    await this.prisma.agent.upsert({
      where: { id: agent.id },
      update: {
        name: data.name,
        avatar: data.avatar,
        description: data.description,
      },
      create: data,
    });
  }

  async findById(id: string): Promise<Agent | null> {
    const agent = await this.prisma.agent.findUnique({ where: { id } });
    if (!agent) return null;
    return this.toDomain(agent);
  }

  async findByUserId(userId: string): Promise<Agent[]> {
    const agents = await this.prisma.agent.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
    return agents.map((a) => this.toDomain(a));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.agent.delete({ where: { id } });
  }
}
