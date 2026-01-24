import { PrismaService } from '../../../prisma/prisma.service';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactRepository } from '../../domain/repositories/contact.repository.interface';
export declare class PrismaContactRepository implements ContactRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toDomain;
    save(contact: Contact): Promise<void>;
    findById(id: string): Promise<Contact | null>;
    findAll(): Promise<Contact[]>;
}
