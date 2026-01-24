import { ContactRepository } from '../../domain/repositories/contact.repository.interface';
export interface SendContactInput {
    name: string;
    email: string;
    company?: string;
    subject: string;
    message: string;
}
export declare class SendContactUseCase {
    private readonly contactRepository;
    constructor(contactRepository: ContactRepository);
    execute(input: SendContactInput): Promise<{
        success: boolean;
        message: string;
    }>;
    private isValidEmail;
}
