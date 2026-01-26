import { IsString, MinLength, MaxLength, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ example: 'Ola, como posso ajudar?', description: 'Conteudo da mensagem' })
  @IsString()
  @MinLength(1, { message: 'Mensagem nao pode ser vazia' })
  @MaxLength(5000, { message: 'Mensagem muito longa' })
  content: string;
}

export class CreateChatDto {
  @ApiProperty({ example: 'uuid-do-agente', description: 'ID do agente' })
  @IsUUID()
  agent_id: string;

  @ApiPropertyOptional({ example: 'Conversa sobre IA', description: 'Titulo do chat' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;
}
