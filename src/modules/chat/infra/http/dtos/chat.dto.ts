import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ example: 'Ola, como posso ajudar?', description: 'Conteudo da mensagem' })
  @IsString()
  @MinLength(1, { message: 'Mensagem nao pode ser vazia' })
  @MaxLength(5000, { message: 'Mensagem muito longa' })
  content: string;
}
