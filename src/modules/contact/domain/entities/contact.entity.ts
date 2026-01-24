import { Entity } from '../../../../core/base-classes';

export interface ContactProps {
  name: string;
  email: string;
  company?: string | null;
  subject: string;
  message: string;
  createdAt?: Date;
}

export class Contact extends Entity<ContactProps> {
  constructor(props: ContactProps, id?: string) {
    super(props, id);
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get company() {
    return this.props.company;
  }

  get subject() {
    return this.props.subject;
  }

  get message() {
    return this.props.message;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
