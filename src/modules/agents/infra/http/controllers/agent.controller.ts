import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common';
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
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar agentes do usuario' })
  @ApiQuery({ name: 'user_id', required: true, description: 'ID do usuario' })
  @ApiResponse({ status: 200, description: 'Lista de agentes' })
  async list(@Query('user_id') userId: string) {
    return this.listUseCase.execute(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo agente' })
  @ApiResponse({ status: 201, description: 'Agente criado com sucesso' })
  async create(@Body() body: CreateAgentDto) {
    return this.createUseCase.execute(body);
  }

  @Put(':agent_id')
  @ApiOperation({ summary: 'Atualizar agente' })
  @ApiResponse({ status: 200, description: 'Agente atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Agente nao encontrado' })
  async update(@Param('agent_id') agentId: string, @Body() body: UpdateAgentDto) {
    return this.updateUseCase.execute(agentId, body);
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
