import { Entity } from '../../../../core/base-classes';
export interface ContactProps {
    name: string;
    email: string;
    company?: string | null;
    subject: string;
    message: string;
    createdAt?: Date;
}
export declare class Contact extends Entity<ContactProps> {
    constructor(props: ContactProps, id?: string);
    get name(): string;
    get email(): string;
    get company(): string | null | undefined;
    get subject(): string;
    get message(): string;
    get createdAt(): Date | undefined;
}
