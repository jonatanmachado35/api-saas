import { SendContactUseCase } from '../../../application/use-cases/send-contact.use-case';
import { SendContactDto } from '../dtos/send-contact.dto';
export declare class ContactController {
    private readonly sendContactUseCase;
    constructor(sendContactUseCase: SendContactUseCase);
    sendContact(body: SendContactDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
