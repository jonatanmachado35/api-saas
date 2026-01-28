import { PrismaService } from '../../../prisma/prisma.service';
import { Product, ProductType } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../domain/repositories/product.repository.interface';
export declare class PrismaProductRepository implements ProductRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private toDomain;
    save(product: Product): Promise<void>;
    findById(id: string): Promise<Product | null>;
    findBySlug(slug: string): Promise<Product | null>;
    findByType(type: ProductType): Promise<Product[]>;
    findAllActive(): Promise<Product[]>;
    findAll(): Promise<Product[]>;
    delete(id: string): Promise<void>;
}
