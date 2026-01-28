import { Entity } from '../../../../core/base-classes';

export enum ProductType {
  SUBSCRIPTION = 'SUBSCRIPTION',
  CREDITS = 'CREDITS',
}

export interface ProductProps {
  type: ProductType;
  slug: string;
  name: string;
  description?: string;
  price: number;
  credits?: number;
  bonus?: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product extends Entity<ProductProps> {
  constructor(props: ProductProps, id?: string) {
    super(props, id);
  }

  get type() { return this.props.type; }
  get slug() { return this.props.slug; }
  get name() { return this.props.name; }
  get description() { return this.props.description; }
  get price() { return this.props.price; }
  get credits() { return this.props.credits; }
  get bonus() { return this.props.bonus; }
  get active() { return this.props.active; }

  activate(): void {
    this.props.active = true;
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.active = false;
    this.props.updatedAt = new Date();
  }

  updatePrice(newPrice: number): void {
    this.props.price = newPrice;
    this.props.updatedAt = new Date();
  }
}
