import { Entity } from '../../../../core/base-classes';
export declare enum ProductType {
    SUBSCRIPTION = "SUBSCRIPTION",
    CREDITS = "CREDITS"
}
export interface ProductProps {
    type: ProductType;
    slug: string;
    name: string;
    description?: string;
    price: number;
    credits?: number;
    bonus?: number;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class Product extends Entity<ProductProps> {
    constructor(props: ProductProps, id?: string);
    get type(): ProductType;
    get slug(): string;
    get name(): string;
    get description(): string | undefined;
    get price(): number;
    get credits(): number | undefined;
    get bonus(): number | undefined;
    get active(): boolean;
    activate(): void;
    deactivate(): void;
    updatePrice(newPrice: number): void;
}
