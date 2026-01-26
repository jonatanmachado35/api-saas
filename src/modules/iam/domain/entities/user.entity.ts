import { Entity } from '../../../../core/base-classes';

export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
}

export interface UserProps {
  email: string;
  password?: string | null;
  googleId?: string | null;
  githubId?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Entity<UserProps> {
  constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get googleId() {
    return this.props.googleId;
  }

  get githubId() {
    return this.props.githubId;
  }

  get fullName() {
    return this.props.fullName;
  }

  get avatarUrl() {
    return this.props.avatarUrl;
  }

  get role() {
    return this.props.role;
  }

  updateProfile(fullName?: string, avatarUrl?: string) {
    if (fullName !== undefined) this.props.fullName = fullName;
    if (avatarUrl !== undefined) this.props.avatarUrl = avatarUrl;
  }

  changeRole(role: UserRole) {
    this.props.role = role;
  }
}
