import { Payment } from '../entities/payment.entity';
export interface PaymentRepository {
    save(payment: Payment): Promise<void>;
    findById(id: string): Promise<Payment | null>;
    findByExternalId(externalId: string): Promise<Payment | null>;
    findByUserId(userId: string): Promise<Payment[]>;
}
