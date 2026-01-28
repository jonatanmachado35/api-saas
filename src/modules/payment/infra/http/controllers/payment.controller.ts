import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../iam/infra/security/jwt-auth.guard';
import {
  CreateSubscriptionPaymentUseCase,
  CreateCreditsPaymentUseCase,
  GetPaymentUseCase,
  ListPaymentsUseCase,
} from '../../../application/use-cases/payment.use-cases';
import { ProcessPaymentWebhookUseCase } from '../../../application/use-cases/webhook.use-case';
import {
  CreateSubscriptionPaymentDto,
  CreateCreditsPaymentDto,
  WebhookDto,
} from '../dtos/payment.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly createSubscriptionPayment: CreateSubscriptionPaymentUseCase,
    private readonly createCreditsPayment: CreateCreditsPaymentUseCase,
    private readonly getPayment: GetPaymentUseCase,
    private readonly listPayments: ListPaymentsUseCase,
  ) {}

  @Post('subscription/checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Criar checkout de assinatura' })
  @ApiResponse({ status: 200, description: 'Checkout criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Plano inválido' })
  async createSubscriptionCheckout(@Req() req: any, @Body() body: CreateSubscriptionPaymentDto) {
    return this.createSubscriptionPayment.execute({
      userId: req.user.id,
      plan: body.plan,
      email: req.user.email,
      returnUrl: body.returnUrl,
    });
  }

  @Post('credits/checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Criar checkout de créditos' })
  @ApiResponse({ status: 200, description: 'Checkout criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Pacote inválido' })
  async createCreditsCheckout(@Req() req: any, @Body() body: CreateCreditsPaymentDto) {
    return this.createCreditsPayment.execute({
      userId: req.user.id,
      packageId: body.packageId,
      email: req.user.email,
      returnUrl: body.returnUrl,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter pagamento por ID' })
  @ApiResponse({ status: 200, description: 'Pagamento encontrado' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado' })
  async getPaymentById(@Req() req: any, @Param('id') id: string) {
    return this.getPayment.execute(id, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os pagamentos do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de pagamentos' })
  async listUserPayments(@Req() req: any) {
    return this.listPayments.execute(req.user.id);
  }
}

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly processWebhook: ProcessPaymentWebhookUseCase) {}

  @Post('abacatepay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook do AbacatePay' })
  @ApiResponse({ status: 200, description: 'Webhook processado com sucesso' })
  async handleAbacatePayWebhook(@Body() body: WebhookDto) {
    return this.processWebhook.execute(body);
  }
}
