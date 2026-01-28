import { Entity } from '../../../../core/base-classes';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentType {
  SUBSCRIPTION = 'SUBSCRIPTION',
  CREDITS = 'CREDITS',
}

export enum PaymentFrequency {
  ONE_TIME = 'ONE_TIME',
  MONTHLY = 'MONTHLY',
}

export interface PaymentProps {
  userId: string;
  type: PaymentType;
  amount: number;
  description: string;
  status: PaymentStatus;
  frequency: PaymentFrequency;
  externalId?: string; // ID do AbacatePay
  paymentUrl?: string; // URL de pagamento
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Payment extends Entity<PaymentProps> {
  constructor(props: PaymentProps, id?: string) {
    super(props, id);
  }

  get userId() { return this.props.userId; }
  get type() { return this.props.type; }
  get amount() { return this.props.amount; }
  get description() { return this.props.description; }
  get status() { return this.props.status; }
  get frequency() { return this.props.frequency; }
  get externalId() { return this.props.externalId; }
  get paymentUrl() { return this.props.paymentUrl; }
  get metadata() { return this.props.metadata; }

  markAsPaid(externalId: string): void {
    this.props.status = PaymentStatus.PAID;
    this.props.externalId = externalId;
    this.props.updatedAt = new Date();
  }

  markAsFailed(): void {
    this.props.status = PaymentStatus.FAILED;
    this.props.updatedAt = new Date();
  }

  cancel(): void {
    this.props.status = PaymentStatus.CANCELED;
    this.props.updatedAt = new Date();
  }

  refund(): void {
    this.props.status = PaymentStatus.REFUNDED;
    this.props.updatedAt = new Date();
  }
}
