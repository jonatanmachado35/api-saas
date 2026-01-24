export declare abstract class Entity<T> {
    protected readonly _id: string;
    readonly props: T;
    constructor(props: T, id?: string);
    get id(): string;
}
export interface Repository<T> {
    save(entity: T): Promise<void>;
    findById(id: string): Promise<T | null>;
}
