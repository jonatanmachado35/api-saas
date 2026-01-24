import { Controller, Get, Post, Body, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../iam/infra/security/jwt-auth.guard';
import {
  GetSubscriptionUseCase,
  UpgradePlanUseCase,
  DowngradePlanUseCase,
  PurchaseCreditsUseCase,
} from '../../../application/use-cases/subscription.use-cases';
import { UpgradePlanDto, PurchaseCreditsDto } from '../dtos/subscription.dto';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionController {
  constructor(
    private readonly getSubscriptionUseCase: GetSubscriptionUseCase,
    private readonly upgradePlanUseCase: UpgradePlanUseCase,
    private readonly downgradePlanUseCase: DowngradePlanUseCase,
    private readonly purchaseCreditsUseCase: PurchaseCreditsUseCase,
  ) {}

  @Get(':user_id')
  @ApiOperation({ summary: 'Obter assinatura do usuario' })
  @ApiResponse({ status: 200, description: 'Dados da assinatura' })
  async getByUserId(@Param('user_id') userId: string) {
    return this.getSubscriptionUseCase.execute(userId);
  }

  @Post('upgrade')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer upgrade de plano' })
  @ApiResponse({ status: 200, description: 'Upgrade realizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Assinatura nao encontrada' })
  async upgrade(@Req() req: any, @Body() body: UpgradePlanDto) {
    return this.upgradePlanUseCase.execute(req.user.id, body.plan);
  }

  @Post('downgrade')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer downgrade para plano free' })
  @ApiResponse({ status: 200, description: 'Downgrade realizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Assinatura nao encontrada' })
  async downgrade(@Req() req: any) {
    return this.downgradePlanUseCase.execute(req.user.id);
  }
}

@ApiTags('Credits')
@Controller('credits')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CreditsController {
  constructor(private readonly purchaseCreditsUseCase: PurchaseCreditsUseCase) {}

  @Post('purchase')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Comprar creditos' })
  @ApiResponse({ status: 200, description: 'Creditos comprados com sucesso' })
  @ApiResponse({ status: 400, description: 'Pacote invalido' })
  @ApiResponse({ status: 404, description: 'Assinatura nao encontrada' })
  async purchase(@Req() req: any, @Body() body: PurchaseCreditsDto) {
    return this.purchaseCreditsUseCase.execute(req.user.id, body.package_id);
  }
}
