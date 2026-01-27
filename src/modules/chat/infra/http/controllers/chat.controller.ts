import { Controller, Get, Post, Delete, Body, Param, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ListChatsUseCase, SendMessageUseCase, CreateChatUseCase, ListMessagesUseCase, ClearChatUseCase } from '../../../application/use-cases/chat.use-cases';
import { JwtAuthGuard } from '../../../../iam/infra/security/jwt-auth.guard';
import { MessageSender } from '../../../domain/entities/chat.entity';
import { SendMessageDto, CreateChatDto } from '../dtos/chat.dto';
import { CurrentUser } from '../../../../../core/decorators/current-user.decorator';

@ApiTags('Chats')
@Controller('chats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(
    private readonly listUseCase: ListChatsUseCase,
    private readonly sendUseCase: SendMessageUseCase,
    private readonly createUseCase: CreateChatUseCase,
    private readonly listMessagesUseCase: ListMessagesUseCase,
    private readonly clearChatUseCase: ClearChatUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar chats do usuario' })
  @ApiResponse({ status: 200, description: 'Lista de chats' })
  async list(@CurrentUser() user: any) {
    return this.listUseCase.execute(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo chat com um agente' })
  @ApiResponse({ status: 201, description: 'Chat criado com sucesso' })
  @ApiResponse({ status: 404, description: 'Agente nao encontrado' })
  async create(@CurrentUser() user: any, @Body() body: CreateChatDto) {
    return this.createUseCase.execute(user.id, body.agent_id, body.title);
  }

  @Get(':chat_id/messages')
  @ApiOperation({ summary: 'Listar mensagens de um chat' })
  @ApiResponse({ status: 200, description: 'Lista de mensagens do chat' })
  @ApiResponse({ status: 404, description: 'Chat nao encontrado' })
  async listMessages(
    @Param('chat_id') chatId: string,
    @CurrentUser() user: any,
  ) {
    return this.listMessagesUseCase.execute(chatId, user.id);
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

  @Delete(':chat_id/messages')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Limpar todas as mensagens de um chat' })
  @ApiResponse({ status: 200, description: 'Chat limpo com sucesso' })
  @ApiResponse({ status: 404, description: 'Chat nao encontrado' })
  async clearChat(
    @Param('chat_id') chatId: string,
    @CurrentUser() user: any,
  ) {
    return this.clearChatUseCase.execute(chatId, user.id);
  }
}
