import { Controller, Get, Post, Body, Param, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ListChatsUseCase, SendMessageUseCase } from '../../../application/use-cases/chat.use-cases';
import { JwtAuthGuard } from '../../../../iam/infra/security/jwt-auth.guard';
import { MessageSender } from '../../../domain/entities/chat.entity';
import { SendMessageDto } from '../dtos/chat.dto';

@ApiTags('Chats')
@Controller('chats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(
    private readonly listUseCase: ListChatsUseCase,
    private readonly sendUseCase: SendMessageUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar chats do usuario' })
  @ApiQuery({ name: 'user_id', required: true, description: 'ID do usuario' })
  @ApiResponse({ status: 200, description: 'Lista de chats' })
  async list(@Query('user_id') userId: string) {
    return this.listUseCase.execute(userId);
  }

  @Post(':chat_id/messages')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enviar mensagem no chat' })
  @ApiResponse({ status: 200, description: 'Mensagem enviada com sucesso' })
  @ApiResponse({ status: 404, description: 'Chat nao encontrado' })
  async sendMessage(
    @Param('chat_id') chatId: string,
    @Body() body: SendMessageDto,
  ) {
    return this.sendUseCase.execute(chatId, body.content, MessageSender.USER);
  }
}
