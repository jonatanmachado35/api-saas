import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsInt, IsOptional, Min, IsBoolean, MinLength, Matches } from 'class-validator';

export enum ProductTypeDto {
  SUBSCRIPTION = 'subscription',
  CREDITS = 'credits',
}

export class CreateProductDto {
  @ApiProperty({ example: 'credits', enum: ProductTypeDto, description: 'Tipo de produto' })
  @IsEnum(ProductTypeDto)
  type: ProductTypeDto;

  @ApiProperty({ example: 'popular', description: 'Slug único (usado na URL)' })
  @IsString()
  @MinLength(3)
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug deve conter apenas letras minúsculas, números e hífens' })
  slug: string;

  @ApiProperty({ example: 'Pacote Popular', description: 'Nome do produto' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional({ example: '500 créditos + 50 bônus', description: 'Descrição do produto' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 3990, description: 'Preço em centavos (R$ 39,90)' })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 500, description: 'Quantidade de créditos base (para tipo CREDITS)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  credits?: number;

  @ApiPropertyOptional({ example: 50, description: 'Créditos bônus (para tipo CREDITS)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  bonus?: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Pacote Popular Premium', description: 'Nome do produto' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiPropertyOptional({ example: 'Descrição atualizada', description: 'Descrição do produto' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 4990, description: 'Preço em centavos' })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 600, description: 'Quantidade de créditos base' })
  @IsOptional()
  @IsInt()
  @Min(0)
  credits?: number;

  @ApiPropertyOptional({ example: 100, description: 'Créditos bônus' })
  @IsOptional()
  @IsInt()
  @Min(0)
  bonus?: number;

  @ApiPropertyOptional({ example: true, description: 'Produto ativo/inativo' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
