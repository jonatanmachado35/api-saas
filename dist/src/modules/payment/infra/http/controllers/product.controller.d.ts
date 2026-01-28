import { ListProductsUseCase, GetProductBySlugUseCase, CreateProductUseCase, UpdateProductUseCase, DeleteProductUseCase } from '../../../application/use-cases/product.use-cases';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
export declare class ProductController {
    private readonly listProducts;
    private readonly getProductBySlug;
    constructor(listProducts: ListProductsUseCase, getProductBySlug: GetProductBySlugUseCase);
    list(): Promise<{
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
    getBySlug(slug: string): Promise<{
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
export declare class AdminProductController {
    private readonly listProducts;
    private readonly createProduct;
    private readonly updateProduct;
    private readonly deleteProduct;
    constructor(listProducts: ListProductsUseCase, createProduct: CreateProductUseCase, updateProduct: UpdateProductUseCase, deleteProduct: DeleteProductUseCase);
    listAll(activeOnly?: string): Promise<{
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
    create(body: CreateProductDto): Promise<{
        id: string;
        slug: string;
        name: string;
        price: number;
    }>;
    update(id: string, body: UpdateProductDto): Promise<{
        id: string;
        slug: string;
        name: string;
        price: number;
        active: boolean;
    }>;
    delete(id: string): Promise<void>;
}
