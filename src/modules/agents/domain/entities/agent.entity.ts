import { Entity } from '../../../../core/base-classes';

export enum AgentVisibility {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  PRO_ONLY = 'PRO_ONLY',
  CUSTOM_ONLY = 'CUSTOM_ONLY',
  ADMIN_ONLY = 'ADMIN_ONLY',
}

export interface AgentProps {
  userId: string;
  name: string;
  avatar?: string | null;
  description?: string | null;
  prompt?: string | null;
  category?: string | null;
  type?: string | null;
  tone?: string | null;
  style?: string | null;
  focus?: string | null;
  rules?: string | null;
  visibility?: AgentVisibility;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Agent extends Entity<AgentProps> {
  constructor(props: AgentProps, id?: string) {
    super(props, id);
    if (!props.visibility) {
      this.props.visibility = AgentVisibility.PRIVATE;
    }
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
  get prompt() {
    return this.props.prompt;
  }
  get category() {
    return this.props.category;
  }
  get type() {
    return this.props.type;
  }
  get tone() {
    return this.props.tone;
  }
  get style() {
    return this.props.style;
  }
  get focus() {
    return this.props.focus;
  }
  get rules() {
    return this.props.rules;
  }
  get visibility() {
    return this.props.visibility;
  }
}
