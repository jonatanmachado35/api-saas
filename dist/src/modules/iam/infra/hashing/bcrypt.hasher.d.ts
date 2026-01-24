export declare class BcryptHasher {
    private readonly saltRounds;
    hash(value: string): Promise<string>;
    compare(value: string, hash: string): Promise<boolean>;
}
