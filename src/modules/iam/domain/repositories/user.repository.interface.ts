import { Repository } from '../../../../core/base-classes';
import { User } from '../entities/user.entity';

export interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
