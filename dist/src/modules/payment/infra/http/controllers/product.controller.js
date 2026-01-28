"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProductController = exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../../iam/infra/security/jwt-auth.guard");
const roles_guard_1 = require("../../../../../core/guards/roles.guard");
const roles_decorator_1 = require("../../../../../core/decorators/roles.decorator");
const product_use_cases_1 = require("../../../application/use-cases/product.use-cases");
const product_dto_1 = require("../dtos/product.dto");
let ProductController = class ProductController {
    listProducts;
    getProductBySlug;
    constructor(listProducts, getProductBySlug) {
        this.listProducts = listProducts;
        this.getProductBySlug = getProductBySlug;
    }
    async list() {
        return this.listProducts.execute(true);
    }
    async getBySlug(slug) {
        return this.getProductBySlug.execute(slug);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os produtos ativos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de produtos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter produto por slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Produto encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getBySlug", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_use_cases_1.ListProductsUseCase,
        product_use_cases_1.GetProductBySlugUseCase])
], ProductController);
let AdminProductController = class AdminProductController {
    listProducts;
    createProduct;
    updateProduct;
    deleteProduct;
    constructor(listProducts, createProduct, updateProduct, deleteProduct) {
        this.listProducts = listProducts;
        this.createProduct = createProduct;
        this.updateProduct = updateProduct;
        this.deleteProduct = deleteProduct;
    }
    async listAll(activeOnly) {
        const active = activeOnly === 'true';
        return this.listProducts.execute(active);
    }
    async create(body) {
        return this.createProduct.execute(body);
    }
    async update(id, body) {
        return this.updateProduct.execute(id, body);
    }
    async delete(id) {
        await this.deleteProduct.execute(id);
    }
};
exports.AdminProductController = AdminProductController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os produtos (incluindo inativos)' }),
    (0, swagger_1.ApiQuery)({ name: 'activeOnly', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de produtos' }),
    __param(0, (0, common_1.Query)('activeOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProductController.prototype, "listAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo produto' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Produto criado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Slug já existe' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], AdminProductController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar produto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Produto atualizado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], AdminProductController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Deletar produto' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Produto deletado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produto não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminProductController.prototype, "delete", null);
exports.AdminProductController = AdminProductController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Products'),
    (0, common_1.Controller)('admin/products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [product_use_cases_1.ListProductsUseCase,
        product_use_cases_1.CreateProductUseCase,
        product_use_cases_1.UpdateProductUseCase,
        product_use_cases_1.DeleteProductUseCase])
], AdminProductController);
//# sourceMappingURL=product.controller.js.map