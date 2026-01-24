import { Entity } from '../../../../core/base-classes';

export enum MessageSender {
  USER = 'USER',
  AGENT = 'AGENT',
}

export interface MessageProps {
  chatId: string;
  content: string;
  sender: MessageSender;
  timestamp?: Date;
}

export class Message extends Entity<MessageProps> {
  constructor(props: MessageProps, id?: string) {
    super(props, id);
  }

  get chatId() { return this.props.chatId; }
  get content() { return this.props.content; }
  get sender() { return this.props.sender; }
}

export interface ChatProps {
  userId: string;
  agentId: string;
  title?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Chat extends Entity<ChatProps> {
  constructor(props: ChatProps, id?: string) {
    super(props, id);
  }

  get userId() { return this.props.userId; }
  get agentId() { return this.props.agentId; }
  get title() { return this.props.title; }
}
