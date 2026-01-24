import { IsString, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({ example: 'uuid', description: 'ID do usuario dono do agente' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: 'Meu Agente', description: 'Nome do agente' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: '🤖', description: 'Emoji ou icone do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  avatar?: string;

  @ApiPropertyOptional({ example: 'Descricao do agente', description: 'Descricao do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
