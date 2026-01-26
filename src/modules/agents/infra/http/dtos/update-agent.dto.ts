import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AgentVisibility } from '../../../domain/entities/agent.entity';

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

  @ApiPropertyOptional({ example: 'Voce e um assistente prestativo...', description: 'Prompt do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  prompt?: string;

  @ApiPropertyOptional({ example: 'Atendimento', description: 'Categoria do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ example: 'Assistente Virtual', description: 'Tipo do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  type?: string;

  @ApiPropertyOptional({ example: 'Profissional', description: 'Tom de voz do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tone?: string;

  @ApiPropertyOptional({ example: 'Formal', description: 'Estilo de comunicacao do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  style?: string;

  @ApiPropertyOptional({ example: 'Suporte tecnico', description: 'Foco principal do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  focus?: string;

  @ApiPropertyOptional({ example: 'Sempre seja educado...', description: 'Regras de comportamento do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  rules?: string;

  @ApiPropertyOptional({ 
    enum: AgentVisibility, 
    example: AgentVisibility.PRIVATE,
    description: 'Visibilidade: PRIVATE (apenas criador), PUBLIC (todos usuarios FREE+), PRO_ONLY (PRO e CUSTOM), CUSTOM_ONLY (apenas CUSTOM), ADMIN_ONLY (apenas admins)'
  })
  @IsOptional()
  @IsEnum(AgentVisibility)
  visibility?: AgentVisibility;
}
