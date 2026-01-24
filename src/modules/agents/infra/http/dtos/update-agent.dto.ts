import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAgentDto {
  @ApiPropertyOptional({ example: 'Novo Nome', description: 'Nome do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: '🧠', description: 'Emoji ou icone do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  avatar?: string;

  @ApiPropertyOptional({ example: 'Nova descricao', description: 'Descricao do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
