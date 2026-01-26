import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, HttpCode, HttpStatus, Req, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {
  CreateAgentUseCase,
  UpdateAgentUseCase,
  ListAgentsUseCase,
  DeleteAgentUseCase,
} from '../../../application/use-cases/agent.use-cases';
import { JwtAuthGuard } from '../../../../iam/infra/security/jwt-auth.guard';
import { CreateAgentDto } from '../dtos/create-agent.dto';
import { UpdateAgentDto } from '../dtos/update-agent.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CurrentUser } from '../../../../../core/decorators/current-user.decorator';
import { EmptyStringToNullPipe } from '../../../../../core/pipes/empty-string-to-null.pipe';

@ApiTags('Agents')
@Controller('agents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AgentController {
  constructor(
    private readonly createUseCase: CreateAgentUseCase,
    private readonly updateUseCase: UpdateAgentUseCase,
    private readonly listUseCase: ListAgentsUseCase,
    private readonly deleteUseCase: DeleteAgentUseCase,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar agentes acessiveis ao usuario' })
  @ApiResponse({ status: 200, description: 'Lista de agentes' })
  async list(@CurrentUser() user: any) {
    // Buscar subscription do usuario
    const subscription = await this.prisma.subscription.findUnique({
      where: { user_id: user.id },
    });
    
    const userPlan = subscription?.plan || 'FREE';
    return this.listUseCase.execute(user.id, user.role, userPlan);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo agente' })
  @ApiResponse({ status: 201, description: 'Agente criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissao para criar agente com essa visibilidade' })
  @UsePipes(new EmptyStringToNullPipe())
  async create(@CurrentUser() user: any, @Body() body: CreateAgentDto) {
    return this.createUseCase.execute({
      ...body,
      user_id: user.id,
      user_role: user.role,
    });
  }

  @Put(':agent_id')
  @ApiOperation({ summary: 'Atualizar agente' })
  @ApiResponse({ status: 200, description: 'Agente atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Agente nao encontrado' })
  @ApiResponse({ status: 403, description: 'Sem permissao para alterar visibilidade' })
  @UsePipes(new EmptyStringToNullPipe())
  async update(@CurrentUser() user: any, @Param('agent_id') agentId: string, @Body() body: UpdateAgentDto) {
    return this.updateUseCase.execute(agentId, {
      ...body,
      user_role: user.role,
    });
  }

  @Delete(':agent_id')
  @ApiOperation({ summary: 'Deletar agente' })
  @ApiResponse({ status: 200, description: 'Agente deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Agente nao encontrado' })
  async delete(@Param('agent_id') agentId: string) {
    await this.deleteUseCase.execute(agentId);
    return { success: true };
  }
}
