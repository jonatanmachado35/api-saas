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
exports.DeleteProductUseCase = exports.UpdateProductUseCase = exports.CreateProductUseCase = exports.GetProductBySlugUseCase = exports.ListProductsUseCase = void 0;
const common_1 = require("@nestjs/common");
const product_entity_1 = require("../../domain/entities/product.entity");
let ListProductsUseCase = class ListProductsUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(activeOnly = true) {
        const products = activeOnly
            ? await this.productRepository.findAllActive()
            : await this.productRepository.findAll();
        return products.map((p) => ({
            id: p.id,
            type: p.type.toLowerCase(),
            slug: p.slug,
            name: p.name,
            description: p.description,
            price: p.price,
            credits: p.credits,
            bonus: p.bonus,
            active: p.active,
            createdAt: p.props.createdAt,
        }));
    }
};
exports.ListProductsUseCase = ListProductsUseCase;
exports.ListProductsUseCase = ListProductsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepository')),
    __metadata("design:paramtypes", [Object])
], ListProductsUseCase);
let GetProductBySlugUseCase = class GetProductBySlugUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(slug) {
        const product = await this.productRepository.findBySlug(slug);
        if (!product || !product.active) {
            throw new common_1.NotFoundException('Product not found');
        }
        return {
            id: product.id,
            type: product.type.toLowerCase(),
            slug: product.slug,
            name: product.name,
            description: product.description,
            price: product.price,
            credits: product.credits,
            bonus: product.bonus,
        };
    }
};
exports.GetProductBySlugUseCase = GetProductBySlugUseCase;
exports.GetProductBySlugUseCase = GetProductBySlugUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepository')),
    __metadata("design:paramtypes", [Object])
], GetProductBySlugUseCase);
let CreateProductUseCase = class CreateProductUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(input) {
        const existing = await this.productRepository.findBySlug(input.slug);
        if (existing) {
            throw new common_1.ConflictException('Product with this slug already exists');
        }
        const product = new product_entity_1.Product({
            type: input.type.toUpperCase(),
            slug: input.slug,
            name: input.name,
            description: input.description,
            price: input.price,
            credits: input.credits,
            bonus: input.bonus,
            active: true,
        });
        await this.productRepository.save(product);
        return {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
        };
    }
};
exports.CreateProductUseCase = CreateProductUseCase;
exports.CreateProductUseCase = CreateProductUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepository')),
    __metadata("design:paramtypes", [Object])
], CreateProductUseCase);
let UpdateProductUseCase = class UpdateProductUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(productId, input) {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const updatedProduct = new product_entity_1.Product({
            ...product.props,
            name: input.name ?? product.name,
            description: input.description ?? product.description,
            price: input.price ?? product.price,
            credits: input.credits ?? product.credits,
            bonus: input.bonus ?? product.bonus,
            active: input.active ?? product.active,
            updatedAt: new Date(),
        }, product.id);
        await this.productRepository.save(updatedProduct);
        return {
            id: updatedProduct.id,
            slug: updatedProduct.slug,
            name: updatedProduct.name,
            price: updatedProduct.price,
            active: updatedProduct.active,
        };
    }
};
exports.UpdateProductUseCase = UpdateProductUseCase;
exports.UpdateProductUseCase = UpdateProductUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepository')),
    __metadata("design:paramtypes", [Object])
], UpdateProductUseCase);
let DeleteProductUseCase = class DeleteProductUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(productId) {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        await this.productRepository.delete(productId);
        return { success: true };
    }
};
exports.DeleteProductUseCase = DeleteProductUseCase;
exports.DeleteProductUseCase = DeleteProductUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ProductRepository')),
    __metadata("design:paramtypes", [Object])
], DeleteProductUseCase);
//# sourceMappingURL=product.use-cases.js.map