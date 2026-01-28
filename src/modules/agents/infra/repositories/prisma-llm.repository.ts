import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { LlmRepository } from '../../domain/repositories/llm.repository.interface';
import { Llm } from '../../domain/entities/llm.entity';

@Injectable()
export class PrismaLlmRepository implements LlmRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(llm: Llm): Promise<Llm> {
    const data = await this.prisma.llm.create({
      data: {
        id: llm.id,
        name: llm.name,
        provider: llm.provider,
        model: llm.model,
        max_tokens: llm.maxTokens,
        active: llm.active,
      },
    });

    return this.toDomain(data);
  }

  async findById(id: string): Promise<Llm | null> {
    const data = await this.prisma.llm.findUnique({
      where: { id },
    });

    return data ? this.toDomain(data) : null;
  }

  async findAll(activeOnly = false): Promise<Llm[]> {
    const data = await this.prisma.llm.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: { created_at: 'desc' },
    });

    return data.map(this.toDomain);
  }

  async update(llm: Llm): Promise<Llm> {
    const data = await this.prisma.llm.update({
      where: { id: llm.id },
      data: {
        name: llm.name,
        provider: llm.provider,
        model: llm.model,
        max_tokens: llm.maxTokens,
        active: llm.active,
        updated_at: new Date(),
      },
    });

    return this.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.llm.delete({
      where: { id },
    });
  }

  private toDomain(data: any): Llm {
    return new Llm(
      {
        name: data.name,
        provider: data.provider,
        model: data.model,
        maxTokens: data.max_tokens,
        active: data.active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
      data.id,
    );
  }
}
