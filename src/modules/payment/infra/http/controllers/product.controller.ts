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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../iam/infra/security/jwt-auth.guard';
import { RolesGuard } from '../../../../../core/guards/roles.guard';
import { Roles } from '../../../../../core/decorators/roles.decorator';
import { UserRole } from '../../../../iam/domain/entities/user.entity';
import {
  ListProductsUseCase,
  GetProductBySlugUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
} from '../../../application/use-cases/product.use-cases';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly listProducts: ListProductsUseCase,
    private readonly getProductBySlug: GetProductBySlugUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos ativos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos' })
  async list() {
    return this.listProducts.execute(true);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Obter produto por slug' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async getBySlug(@Param('slug') slug: string) {
    return this.getProductBySlug.execute(slug);
  }
}

@ApiTags('Admin - Products')
@Controller('admin/products')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminProductController {
  constructor(
    private readonly listProducts: ListProductsUseCase,
    private readonly createProduct: CreateProductUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly deleteProduct: DeleteProductUseCase,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todos os produtos (incluindo inativos)' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Lista de produtos' })
  async listAll(@Query('activeOnly') activeOnly?: string) {
    const active = activeOnly === 'true';
    return this.listProducts.execute(active);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Slug já existe' })
  async create(@Body() body: CreateProductDto) {
    return this.createProduct.execute(body);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.updateProduct.execute(id, body);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar produto' })
  @ApiResponse({ status: 204, description: 'Produto deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async delete(@Param('id') id: string) {
    await this.deleteProduct.execute(id);
  }
}
