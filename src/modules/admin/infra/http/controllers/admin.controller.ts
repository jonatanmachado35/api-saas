import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../iam/infra/security/jwt-auth.guard';
import { RolesGuard } from '../../../../../core/guards/roles.guard';
import { Roles } from '../../../../../core/decorators/roles.decorator';
import { UserRole } from '../../../../iam/domain/entities/user.entity';
import { GetAdminStatsUseCase } from '../../../application/use-cases/admin-stats.use-case';
import { ListUsersUseCase, ChangeUserRoleUseCase } from '../../../application/use-cases/admin-user.use-cases';
import {
  ListAdminSubscriptionsUseCase,
  ListAllAgentsUseCase,
  CreateAdminSubscriptionUseCase,
  UpdateAdminSubscriptionUseCase,
  CreateAdminAgentUseCase,
  DeleteAdminAgentUseCase,
} from '../../../application/use-cases/admin-mgmt.use-cases';
import {
  ChangeUserRoleDto,
  CreateAdminSubscriptionDto,
  UpdateAdminSubscriptionDto,
  CreateAdminAgentDto,
} from '../dtos/admin.dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.OWNER)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly statsUseCase: GetAdminStatsUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly changeRoleUseCase: ChangeUserRoleUseCase,
    private readonly listSubsUseCase: ListAdminSubscriptionsUseCase,
    private readonly createSubUseCase: CreateAdminSubscriptionUseCase,
    private readonly updateSubUseCase: UpdateAdminSubscriptionUseCase,
    private readonly listAgentsUseCase: ListAllAgentsUseCase,
    private readonly createAgentUseCase: CreateAdminAgentUseCase,
    private readonly deleteAgentUseCase: DeleteAdminAgentUseCase,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatisticas do dashboard' })
  @ApiResponse({ status: 200, description: 'Estatisticas do sistema' })
  @ApiResponse({ status: 403, description: 'Acesso negado - requer role admin' })
  async getStats() {
    return this.statsUseCase.execute();
  }

  @Get('users')
  @ApiOperation({ summary: 'Listar todos os usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  async listUsers() {
    return this.listUsersUseCase.execute();
  }

  @Put('users/:user_id/role')
  @ApiOperation({ summary: 'Alterar role de usuario' })
  @ApiResponse({ status: 200, description: 'Role alterada com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuario nao encontrado' })
  async changeRole(@Param('user_id') userId: string, @Body() body: ChangeUserRoleDto) {
    await this.changeRoleUseCase.execute(userId, body.role);
    return { success: true };
  }

  @Get('subscriptions')
  @ApiOperation({ summary: 'Listar todas as assinaturas' })
  @ApiResponse({ status: 200, description: 'Lista de assinaturas' })
  async listSubscriptions() {
    return this.listSubsUseCase.execute();
  }

  @Post('subscriptions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar assinatura para usuario' })
  @ApiResponse({ status: 201, description: 'Assinatura criada com sucesso' })
  async createSubscription(@Body() body: CreateAdminSubscriptionDto) {
    return this.createSubUseCase.execute(body);
  }

  @Put('subscriptions/:subscription_id')
  @ApiOperation({ summary: 'Atualizar assinatura' })
  @ApiResponse({ status: 200, description: 'Assinatura atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Assinatura nao encontrada' })
  async updateSubscription(
    @Param('subscription_id') subscriptionId: string,
    @Body() body: UpdateAdminSubscriptionDto,
  ) {
    return this.updateSubUseCase.execute(subscriptionId, body);
  }

  @Get('agents')
  @ApiOperation({ summary: 'Listar todos os agentes' })
  @ApiResponse({ status: 200, description: 'Lista de agentes' })
  async listAgents() {
    return this.listAgentsUseCase.execute();
  }

  @Post('agents')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar agente para usuario' })
  @ApiResponse({ status: 201, description: 'Agente criado com sucesso' })
  async createAgent(@Body() body: CreateAdminAgentDto) {
    return this.createAgentUseCase.execute(body);
  }

  @Delete('agents/:agent_id')
  @ApiOperation({ summary: 'Deletar agente' })
  @ApiResponse({ status: 200, description: 'Agente deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Agente nao encontrado' })
  async deleteAgent(@Param('agent_id') agentId: string) {
    return this.deleteAgentUseCase.execute(agentId);
  }
}
