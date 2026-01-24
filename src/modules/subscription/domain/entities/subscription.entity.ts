import { Entity } from '../../../../core/base-classes';

export enum SubscriptionPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  CUSTOM = 'CUSTOM',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PENDING = 'PENDING',
}

export interface SubscriptionProps {
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  credits: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Subscription extends Entity<SubscriptionProps> {
  constructor(props: SubscriptionProps, id?: string) {
    super(props, id);
  }

  get userId() { return this.props.userId; }
  get plan() { return this.props.plan; }
  get status() { return this.props.status; }
  get credits() { return this.props.credits; }
}
