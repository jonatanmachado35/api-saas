import { IsString, IsOptional, IsEnum, IsInt, Min, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PlanType {
  FREE = 'free',
  PRO = 'pro',
  CUSTOM = 'custom',
}

export class UpgradePlanDto {
  @ApiProperty({ example: 'pro', enum: PlanType, description: 'Tipo do plano' })
  @IsEnum(PlanType)
  plan: PlanType;
}

export class PurchaseCreditsDto {
  @ApiProperty({ example: 'popular', description: 'ID do pacote de creditos' })
  @IsString()
  package_id: string;

  @ApiPropertyOptional({ example: 500, description: 'Quantidade de creditos (opcional)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  credits?: number;
}
