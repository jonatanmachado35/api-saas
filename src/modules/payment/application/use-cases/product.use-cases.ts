import { Injectable, Inject, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product, ProductType } from '../../domain/entities/product.entity';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(activeOnly: boolean = true) {
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
}

@Injectable()
export class GetProductBySlugUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(slug: string) {
    const product = await this.productRepository.findBySlug(slug);

    if (!product || !product.active) {
      throw new NotFoundException('Product not found');
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
}

export interface CreateProductInput {
  type: 'subscription' | 'credits';
  slug: string;
  name: string;
  description?: string;
  price: number;
  credits?: number;
  bonus?: number;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(input: CreateProductInput) {
    // Verificar se slug já existe
    const existing = await this.productRepository.findBySlug(input.slug);
    if (existing) {
      throw new ConflictException('Product with this slug already exists');
    }

    const product = new Product({
      type: input.type.toUpperCase() as ProductType,
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
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  credits?: number;
  bonus?: number;
  active?: boolean;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(productId: string, input: UpdateProductInput) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = new Product(
      {
        ...product.props,
        name: input.name ?? product.name,
        description: input.description ?? product.description,
        price: input.price ?? product.price,
        credits: input.credits ?? product.credits,
        bonus: input.bonus ?? product.bonus,
        active: input.active ?? product.active,
        updatedAt: new Date(),
      },
      product.id,
    );

    await this.productRepository.save(updatedProduct);

    return {
      id: updatedProduct.id,
      slug: updatedProduct.slug,
      name: updatedProduct.name,
      price: updatedProduct.price,
      active: updatedProduct.active,
    };
  }
}

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(productId: string) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productRepository.delete(productId);

    return { success: true };
  }
}
