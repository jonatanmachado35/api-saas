import { Entity } from '../../../../core/base-classes';

export interface AgentProps {
  userId: string;
  name: string;
  avatar?: string | null;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Agent extends Entity<AgentProps> {
  constructor(props: AgentProps, id?: string) {
    super(props, id);
  }

  get userId() {
    return this.props.userId;
  }
  get name() {
    return this.props.name;
  }
  get avatar() {
    return this.props.avatar;
  }
  get description() {
    return this.props.description;
  }
}
