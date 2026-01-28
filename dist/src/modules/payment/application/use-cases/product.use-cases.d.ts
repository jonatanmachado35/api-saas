import { ProductRepository } from '../../domain/repositories/product.repository.interface';
export declare class ListProductsUseCase {
    private readonly productRepository;
    constructor(productRepository: ProductRepository);
    execute(activeOnly?: boolean): Promise<{
        id: string;
        type: string;
        slug: string;
        name: string;
        description: string | undefined;
        price: number;
        credits: number | undefined;
        bonus: number | undefined;
        active: boolean;
        createdAt: Date | undefined;
    }[]>;
}
export declare class GetProductBySlugUseCase {
    private readonly productRepository;
    constructor(productRepository: ProductRepository);
    execute(slug: string): Promise<{
        id: string;
        type: string;
        slug: string;
        name: string;
        description: string | undefined;
        price: number;
        credits: number | undefined;
        bonus: number | undefined;
    }>;
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
export declare class CreateProductUseCase {
    private readonly productRepository;
    constructor(productRepository: ProductRepository);
    execute(input: CreateProductInput): Promise<{
        id: string;
        slug: string;
        name: string;
        price: number;
    }>;
}
export interface UpdateProductInput {
    name?: string;
    description?: string;
    price?: number;
    credits?: number;
    bonus?: number;
    active?: boolean;
}
export declare class UpdateProductUseCase {
    private readonly productRepository;
    constructor(productRepository: ProductRepository);
    execute(productId: string, input: UpdateProductInput): Promise<{
        id: string;
        slug: string;
        name: string;
        price: number;
        active: boolean;
    }>;
}
export declare class DeleteProductUseCase {
    private readonly productRepository;
    constructor(productRepository: ProductRepository);
    execute(productId: string): Promise<{
        success: boolean;
    }>;
}
