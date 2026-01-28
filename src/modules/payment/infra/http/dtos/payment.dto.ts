import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsUrl } from 'class-validator';

export enum PaymentPlanType {
  PRO = 'pro',
}

export enum CreditPackageType {
  STARTER = 'starter',
  POPULAR = 'popular',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export class CreateSubscriptionPaymentDto {
  @ApiProperty({ example: 'pro', enum: PaymentPlanType, description: 'Plano de assinatura' })
  @IsEnum(PaymentPlanType)
  plan: PaymentPlanType;

  @ApiPropertyOptional({ example: 'https://app.agentchat.com/dashboard', description: 'URL de retorno após pagamento' })
  @IsOptional()
  @IsUrl()
  returnUrl?: string;
}

export class CreateCreditsPaymentDto {
  @ApiProperty({ example: 'popular', enum: CreditPackageType, description: 'Pacote de créditos' })
  @IsEnum(CreditPackageType)
  packageId: CreditPackageType;

  @ApiPropertyOptional({ example: 'https://app.agentchat.com/dashboard', description: 'URL de retorno após pagamento' })
  @IsOptional()
  @IsUrl()
  returnUrl?: string;
}

export class WebhookDto {
  @ApiProperty({ example: 'bill_12345667', description: 'ID do billing no AbacatePay' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'PAID', description: 'Status do pagamento' })
  @IsString()
  status: string;

  @ApiProperty({ example: 4990, description: 'Valor em centavos' })
  amount: number;

  @ApiProperty({ example: 'MONTHLY', description: 'Frequência do pagamento' })
  @IsString()
  frequency: string;

  @ApiPropertyOptional({ description: 'Metadados adicionais' })
  @IsOptional()
  metadata?: Record<string, any>;
}
