import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendContactUseCase } from '../../../application/use-cases/send-contact.use-case';
import { SendContactDto } from '../dtos/send-contact.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly sendContactUseCase: SendContactUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar formulario de contato' })
  @ApiResponse({ status: 200, description: 'Mensagem enviada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados invalidos' })
  async sendContact(@Body() body: SendContactDto) {
    return this.sendContactUseCase.execute(body);
  }
}
