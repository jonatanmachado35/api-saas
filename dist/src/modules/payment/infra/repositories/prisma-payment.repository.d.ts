import { PrismaService } from '../../../prisma/prisma.service';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentRepository } from '../../domain/repositories/payment.repository.interface';
export declare class PrismaPaymentRepository implements PaymentRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toDomain;
    save(payment: Payment): Promise<void>;
    findById(id: string): Promise<Payment | null>;
    findByExternalId(externalId: string): Promise<Payment | null>;
    findByUserId(userId: string): Promise<Payment[]>;
}
