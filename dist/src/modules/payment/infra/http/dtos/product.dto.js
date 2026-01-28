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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductDto = exports.CreateProductDto = exports.ProductTypeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ProductTypeDto;
(function (ProductTypeDto) {
    ProductTypeDto["SUBSCRIPTION"] = "subscription";
    ProductTypeDto["CREDITS"] = "credits";
})(ProductTypeDto || (exports.ProductTypeDto = ProductTypeDto = {}));
class CreateProductDto {
    type;
    slug;
    name;
    description;
    price;
    credits;
    bonus;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'credits', enum: ProductTypeDto, description: 'Tipo de produto' }),
    (0, class_validator_1.IsEnum)(ProductTypeDto),
    __metadata("design:type", String)
], CreateProductDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'popular', description: 'Slug único (usado na URL)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.Matches)(/^[a-z0-9-]+$/, { message: 'Slug deve conter apenas letras minúsculas, números e hífens' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pacote Popular', description: 'Nome do produto' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '500 créditos + 50 bônus', description: 'Descrição do produto' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3990, description: 'Preço em centavos (R$ 39,90)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 500, description: 'Quantidade de créditos base (para tipo CREDITS)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "credits", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 50, description: 'Créditos bônus (para tipo CREDITS)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "bonus", void 0);
class UpdateProductDto {
    name;
    description;
    price;
    credits;
    bonus;
    active;
}
exports.UpdateProductDto = UpdateProductDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Pacote Popular Premium', description: 'Nome do produto' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Descrição atualizada', description: 'Descrição do produto' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4990, description: 'Preço em centavos' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 600, description: 'Quantidade de créditos base' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "credits", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100, description: 'Créditos bônus' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "bonus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Produto ativo/inativo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProductDto.prototype, "active", void 0);
//# sourceMappingURL=product.dto.js.map