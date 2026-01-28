import { Entity } from '../../../../core/base-classes';

export interface LlmProps {
  name: string;
  provider: string;
  model: string;
  maxTokens: number;
  creditCost: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Llm extends Entity<LlmProps> {
  constructor(props: LlmProps, id?: string) {
    super(props, id);
  }

  get name() {
    return this.props.name;
  }

  get provider() {
    return this.props.provider;
  }

  get model() {
    return this.props.model;
  }

  get maxTokens() {
    return this.props.maxTokens;
  }

  get creditCost() {
    return this.props.creditCost;
  }

  get active() {
    return this.props.active;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  activate(): void {
    this.props.active = true;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.active = false;
    this.props.updatedAt = new Date();
  }

  updateMaxTokens(maxTokens: number): void {
    if (maxTokens <= 0) {
      throw new Error('Max tokens must be greater than 0');
    }
    this.props.maxTokens = maxTokens;
    this.props.updatedAt = new Date();
  }

  updateCreditCost(creditCost: number): void {
    if (creditCost <= 0) {
      throw new Error('Credit cost must be greater than 0');
    }
    this.props.creditCost = creditCost;
    this.props.updatedAt = new Date();
  }

  updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }
    this.props.name = name;
    this.props.updatedAt = new Date();
  }
}
