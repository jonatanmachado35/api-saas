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
        prompt: agent.prompt,
        category: agent.category,
        type: agent.type,
        tone: agent.tone,
        style: agent.style,
        focus: agent.focus,
        rules: agent.rules,
        visibility: agent.visibility,
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
      prompt: agent.prompt,
      category: agent.category,
      type: agent.type,
      tone: agent.tone,
      style: agent.style,
      focus: agent.focus,
      rules: agent.rules,
      visibility: agent.visibility,
    };

    await this.prisma.agent.upsert({
      where: { id: agent.id },
      update: {
        name: data.name,
        avatar: data.avatar,
        description: data.description,
        prompt: data.prompt,
        category: data.category,
        type: data.type,
        tone: data.tone,
        style: data.style,
        focus: data.focus,
        rules: data.rules,
        visibility: data.visibility,
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

  async findAccessibleByUser(userId: string, userRole: string, userPlan: string): Promise<Agent[]> {
    const isAdmin = ['ADMIN', 'MODERATOR', 'OWNER'].includes(userRole);
    const isPremium = ['PRO', 'CUSTOM'].includes(userPlan);

    const whereConditions: any[] = [
      // Agentes privados do proprio usuario
      { user_id: userId, visibility: 'PRIVATE' },
    ];

    // Se for admin, adiciona agentes ADMIN_ONLY
    if (isAdmin) {
      whereConditions.push({ visibility: 'ADMIN_ONLY' });
    }

    // Se for premium, adiciona agentes PREMIUM
    if (isPremium) {
      whereConditions.push({ visibility: 'PREMIUM' });
    }

    const agents = await this.prisma.agent.findMany({
      where: {
        OR: whereConditions,
      },
      orderBy: { created_at: 'desc' },
    });

    return agents.map((a) => this.toDomain(a));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.agent.delete({ where: { id } });
  }
}
