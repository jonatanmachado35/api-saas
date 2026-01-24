import { Entity } from '../../../../core/base-classes';
export declare enum UserRole {
    USER = "USER",
    MODERATOR = "MODERATOR",
    ADMIN = "ADMIN",
    OWNER = "OWNER"
}
export interface UserProps {
    email: string;
    password?: string | null;
    googleId?: string | null;
    fullName?: string | null;
    avatarUrl?: string | null;
    role: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class User extends Entity<UserProps> {
    constructor(props: UserProps, id?: string);
    get email(): string;
    get password(): string | null | undefined;
    get googleId(): string | null | undefined;
    get fullName(): string | null | undefined;
    get avatarUrl(): string | null | undefined;
    get role(): UserRole;
    updateProfile(fullName?: string, avatarUrl?: string): void;
    changeRole(role: UserRole): void;
}
