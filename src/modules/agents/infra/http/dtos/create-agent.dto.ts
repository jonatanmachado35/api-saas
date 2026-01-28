import { IsString, IsOptional, MaxLength, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AgentVisibility } from '../../../domain/entities/agent.entity';

export class CreateAgentDto {
  // Campo ignorado - user_id vem do token JWT
  @IsOptional()
  user_id?: string;

  @ApiPropertyOptional({ example: 'uuid-do-llm', description: 'ID do LLM a ser usado pelo agente' })
  @IsOptional()
  @IsUUID()
  llmId?: string;

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

  @ApiPropertyOptional({ example: 'Voce e um assistente prestativo...', description: 'Prompt do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(20000)
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
  @MaxLength(1000)
  tone?: string;

  @ApiPropertyOptional({ example: 'Formal', description: 'Estilo de comunicacao do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  style?: string;

  @ApiPropertyOptional({ example: 'Suporte tecnico', description: 'Foco principal do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  focus?: string;

  @ApiPropertyOptional({ example: 'Sempre seja educado...', description: 'Regras de comportamento do agente' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
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
