import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Contact } from '../../domain/entities/contact.entity';
import { ContactRepository } from '../../domain/repositories/contact.repository.interface';

@Injectable()
export class PrismaContactRepository implements ContactRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(contact: any): Contact {
    return new Contact(
      {
        name: contact.name,
        email: contact.email,
        company: contact.company,
        subject: contact.subject,
        message: contact.message,
        createdAt: contact.created_at,
      },
      contact.id,
    );
  }

  async save(contact: Contact): Promise<void> {
    await this.prisma.contact.create({
      data: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        company: contact.company,
        subject: contact.subject,
        message: contact.message,
      },
    });
  }

  async findById(id: string): Promise<Contact | null> {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    if (!contact) return null;
    return this.toDomain(contact);
  }

  async findAll(): Promise<Contact[]> {
    const contacts = await this.prisma.contact.findMany({
      orderBy: { created_at: 'desc' },
    });
    return contacts.map((c) => this.toDomain(c));
  }
}
