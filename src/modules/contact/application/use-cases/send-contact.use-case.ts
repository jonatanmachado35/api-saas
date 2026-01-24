import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ContactRepository } from '../../domain/repositories/contact.repository.interface';
import { Contact } from '../../domain/entities/contact.entity';

export interface SendContactInput {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

@Injectable()
export class SendContactUseCase {
  constructor(
    @Inject('ContactRepository')
    private readonly contactRepository: ContactRepository,
  ) {}

  async execute(input: SendContactInput) {
    // Validations
    if (!input.name || input.name.length < 2 || input.name.length > 100) {
      throw new BadRequestException('Name must be between 2 and 100 characters');
    }

    if (!input.email || !this.isValidEmail(input.email)) {
      throw new BadRequestException('Invalid email');
    }

    if (!input.subject || input.subject.length < 5 || input.subject.length > 200) {
      throw new BadRequestException('Subject must be between 5 and 200 characters');
    }

    if (!input.message || input.message.length < 10 || input.message.length > 2000) {
      throw new BadRequestException('Message must be between 10 and 2000 characters');
    }

    const contact = new Contact({
      name: input.name,
      email: input.email,
      company: input.company,
      subject: input.subject,
      message: input.message,
    });

    await this.contactRepository.save(contact);

    return {
      success: true,
      message: 'Mensagem enviada com sucesso',
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
