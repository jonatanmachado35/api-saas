import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Product, ProductType } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository.interface';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(product: any): Product {
    return new Product(
      {
        type: product.type as ProductType,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        credits: product.credits,
        bonus: product.bonus,
        active: product.active,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      },
      product.id,
    );
  }

  async save(product: Product): Promise<void> {
    const data = {
      id: product.id,
      type: product.type,
      slug: product.slug,
      name: product.name,
      description: product.description,
      price: product.price,
      credits: product.credits,
      bonus: product.bonus,
      active: product.active,
    };

    await this.prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: data.name,
        description: data.description,
        price: data.price,
        credits: data.credits,
        bonus: data.bonus,
        active: data.active,
      },
      create: data,
    });
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) return null;
    return this.toDomain(product);
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({ where: { slug } });
    if (!product) return null;
    return this.toDomain(product);
  }

  async findByType(type: ProductType): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { type, active: true },
      orderBy: { price: 'asc' },
    });
    return products.map((p) => this.toDomain(p));
  }

  async findAllActive(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { active: true },
      orderBy: { price: 'asc' },
    });
    return products.map((p) => this.toDomain(p));
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { created_at: 'desc' },
    });
    return products.map((p) => this.toDomain(p));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }
}
