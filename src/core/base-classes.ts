import { randomUUID } from 'crypto';

export abstract class Entity<T> {
  protected readonly _id: string;
  public readonly props: T;

  constructor(props: T, id?: string) {
    this._id = id ? id : randomUUID();
    this.props = props;
  }

  get id(): string {
    return this._id;
  }
}

export interface Repository<T> {
  save(entity: T): Promise<void>;
  findById(id: string): Promise<T | null>;
}
