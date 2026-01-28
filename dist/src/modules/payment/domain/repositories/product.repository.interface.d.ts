import { Product, ProductType } from '../entities/product.entity';
export interface ProductRepository {
    save(product: Product): Promise<void>;
    findById(id: string): Promise<Product | null>;
    findBySlug(slug: string): Promise<Product | null>;
    findByType(type: ProductType): Promise<Product[]>;
    findAllActive(): Promise<Product[]>;
    findAll(): Promise<Product[]>;
    delete(id: string): Promise<void>;
}
