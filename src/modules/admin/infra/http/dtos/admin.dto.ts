import { IsString, IsOptional, IsEnum, IsInt, Min, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AdminRoleType {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  NONE = 'none',
}

export enum AdminPlanType {
  FREE = 'free',
  PRO = 'pro',
  CUSTOM = 'custom',
}

export enum AdminSubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PENDING = 'pending',
}

export class ChangeUserRoleDto {
  @ApiProperty({ example: 'admin', enum: AdminRoleType, description: 'Nova role do usuario' })
  @IsEnum(AdminRoleType)
  role: AdminRoleType;
}

export class CreateAdminSubscriptionDto {
  @ApiProperty({ example: 'uuid', description: 'ID do usuario' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: 'pro', enum: AdminPlanType, description: 'Tipo do plano' })
  @IsEnum(AdminPlanType)
  plan: AdminPlanType;

  @ApiPropertyOptional({ example: 'active', enum: AdminSubscriptionStatus, description: 'Status da assinatura' })
  @IsOptional()
  @IsEnum(AdminSubscriptionStatus)
  status?: AdminSubscriptionStatus;

  @ApiPropertyOptional({ example: 100, description: 'Quantidade de creditos' })
  @IsOptional()
  @IsInt()
  @Min(0)
  credits?: number;
}

export class UpdateAdminSubscriptionDto {
  @ApiPropertyOptional({ example: 'pro', enum: AdminPlanType, description: 'Tipo do plano' })
  @IsOptional()
  @IsEnum(AdminPlanType)
  plan?: AdminPlanType;

  @ApiPropertyOptional({ example: 'active', enum: AdminSubscriptionStatus, description: 'Status da assinatura' })
  @IsOptional()
  @IsEnum(AdminSubscriptionStatus)
  status?: AdminSubscriptionStatus;

  @ApiPropertyOptional({ example: 500, description: 'Quantidade de creditos' })
  @IsOptional()
  @IsInt()
  @Min(0)
  credits?: number;
}

export class CreateAdminAgentDto {
  @ApiProperty({ example: 'uuid', description: 'ID do usuario dono do agente' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: 'Agente Admin', description: 'Nome do agente' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: '🤖', description: 'Emoji do agente' })
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
