import { Entity } from '../../../../core/base-classes';
export declare enum MessageSender {
    USER = "USER",
    AGENT = "AGENT"
}
export interface MessageProps {
    chatId: string;
    content: string;
    sender: MessageSender;
    timestamp?: Date;
}
export declare class Message extends Entity<MessageProps> {
    constructor(props: MessageProps, id?: string);
    get chatId(): string;
    get content(): string;
    get sender(): MessageSender;
}
export interface ChatProps {
    userId: string;
    agentId: string;
    title?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class Chat extends Entity<ChatProps> {
    constructor(props: ChatProps, id?: string);
    get userId(): string;
    get agentId(): string;
    get title(): string | null | undefined;
}
