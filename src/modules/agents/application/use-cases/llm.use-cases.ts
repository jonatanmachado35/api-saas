import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { LlmRepository } from '../../domain/repositories/llm.repository.interface';
import { Llm } from '../../domain/entities/llm.entity';

// ==================== LIST LLMS ====================
export interface ListLlmsInput {
  activeOnly?: boolean;
}

@Injectable()
export class ListLlmsUseCase {
  constructor(
    @Inject('LlmRepository')
    private readonly llmRepository: LlmRepository,
  ) {}

  async execute(input: ListLlmsInput = {}): Promise<Llm[]> {
    return this.llmRepository.findAll(input.activeOnly);
  }
}

// ==================== GET LLM BY ID ====================
export interface GetLlmByIdInput {
  id: string;
}

@Injectable()
export class GetLlmByIdUseCase {
  constructor(
    @Inject('LlmRepository')
    private readonly llmRepository: LlmRepository,
  ) {}

  async execute(input: GetLlmByIdInput): Promise<Llm> {
    const llm = await this.llmRepository.findById(input.id);

    if (!llm) {
      throw new NotFoundException(`LLM with ID ${input.id} not found`);
    }

    return llm;
  }
}

// ==================== CREATE LLM ====================
export interface CreateLlmInput {
  name: string;
  provider: string;
  model: string;
  maxTokens: number;
}

@Injectable()
export class CreateLlmUseCase {
  constructor(
    @Inject('LlmRepository')
    private readonly llmRepository: LlmRepository,
  ) {}

  async execute(input: CreateLlmInput): Promise<Llm> {
    const llm = new Llm({
      name: input.name,
      provider: input.provider,
      model: input.model,
      maxTokens: input.maxTokens,
      active: true,
    });

    return this.llmRepository.create(llm);
  }
}

// ==================== UPDATE LLM ====================
export interface UpdateLlmInput {
  id: string;
  name?: string;
  provider?: string;
  model?: string;
  maxTokens?: number;
  active?: boolean;
}

@Injectable()
export class UpdateLlmUseCase {
  constructor(
    @Inject('LlmRepository')
    private readonly llmRepository: LlmRepository,
  ) {}

  async execute(input: UpdateLlmInput): Promise<Llm> {
    const llm = await this.llmRepository.findById(input.id);

    if (!llm) {
      throw new NotFoundException(`LLM with ID ${input.id} not found`);
    }

    if (input.name !== undefined) {
      llm.updateName(input.name);
    }

    if (input.maxTokens !== undefined) {
      llm.updateMaxTokens(input.maxTokens);
    }

    if (input.active !== undefined) {
      if (input.active) {
        llm.activate();
      } else {
        llm.deactivate();
      }
    }

    return this.llmRepository.update(llm);
  }
}

// ==================== DELETE LLM ====================
export interface DeleteLlmInput {
  id: string;
}

@Injectable()
export class DeleteLlmUseCase {
  constructor(
    @Inject('LlmRepository')
    private readonly llmRepository: LlmRepository,
  ) {}

  async execute(input: DeleteLlmInput): Promise<void> {
    const llm = await this.llmRepository.findById(input.id);

    if (!llm) {
      throw new NotFoundException(`LLM with ID ${input.id} not found`);
    }

    await this.llmRepository.delete(input.id);
  }
}
