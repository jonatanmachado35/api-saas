export declare enum ProductTypeDto {
    SUBSCRIPTION = "subscription",
    CREDITS = "credits"
}
export declare class CreateProductDto {
    type: ProductTypeDto;
    slug: string;
    name: string;
    description?: string;
    price: number;
    credits?: number;
    bonus?: number;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    credits?: number;
    bonus?: number;
    active?: boolean;
}
