import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  ListLlmsUseCase,
  GetLlmByIdUseCase,
  CreateLlmUseCase,
  UpdateLlmUseCase,
  DeleteLlmUseCase,
} from '../../../application/use-cases/llm.use-cases';
import { JwtAuthGuard } from '../../../../iam/infra/security/jwt-auth.guard';
import { RolesGuard } from '../../../../../core/guards/roles.guard';
import { Roles } from '../../../../../core/decorators/roles.decorator';
import { UserRole } from '../../../../iam/domain/entities/user.entity';
import { IsString, IsNumber, Min, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ==================== DTOs ====================
export class CreateLlmDto {
  @ApiProperty({ example: 'GPT-4 Turbo', description: 'Nome do LLM' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'OpenAI', description: 'Provedor do LLM' })
  @IsString()
  provider: string;

  @ApiProperty({ example: 'gpt-4-turbo-preview', description: 'Modelo do LLM' })
  @IsString()
  model: string;

  @ApiProperty({ example: 128000, description: 'Quantidade máxima de tokens' })
  @IsNumber()
  @Min(1)
  maxTokens: number;
}

export class UpdateLlmDto {
  @ApiPropertyOptional({ example: 'GPT-4 Turbo (Updated)', description: 'Nome do LLM' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'OpenAI', description: 'Provedor do LLM' })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ example: 'gpt-4-turbo-preview', description: 'Modelo do LLM' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 128000, description: 'Quantidade máxima de tokens' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxTokens?: number;

  @ApiPropertyOptional({ example: true, description: 'Se o LLM está ativo' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

// ==================== PUBLIC CONTROLLER ====================
@ApiTags('LLMs')
@Controller('llms')
export class LlmController {
  constructor(
    private readonly listLlmsUseCase: ListLlmsUseCase,
    private readonly getLlmByIdUseCase: GetLlmByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar LLMs ativos' })
  async list(@Query('all') all?: string) {
    const activeOnly = all !== 'true';
    return this.listLlmsUseCase.execute({ activeOnly });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter LLM por ID' })
  async getById(@Param('id') id: string) {
    return this.getLlmByIdUseCase.execute({ id });
  }
}

// ==================== ADMIN CONTROLLER ====================
@ApiTags('Admin - LLMs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/llms')
export class AdminLlmController {
  constructor(
    private readonly listLlmsUseCase: ListLlmsUseCase,
    private readonly getLlmByIdUseCase: GetLlmByIdUseCase,
    private readonly createLlmUseCase: CreateLlmUseCase,
    private readonly updateLlmUseCase: UpdateLlmUseCase,
    private readonly deleteLlmUseCase: DeleteLlmUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os LLMs (incluindo inativos)' })
  async list() {
    return this.listLlmsUseCase.execute({ activeOnly: false });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter LLM por ID' })
  async getById(@Param('id') id: string) {
    return this.getLlmByIdUseCase.execute({ id });
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo LLM' })
  async create(@Body() dto: CreateLlmDto) {
    return this.createLlmUseCase.execute(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar LLM' })
  async update(@Param('id') id: string, @Body() dto: UpdateLlmDto) {
    return this.updateLlmUseCase.execute({ id, ...dto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar LLM' })
  async delete(@Param('id') id: string) {
    await this.deleteLlmUseCase.execute({ id });
    return { message: 'LLM deleted successfully' };
  }
}
