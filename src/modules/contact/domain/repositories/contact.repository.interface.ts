import { Repository } from '../../../../core/base-classes';
import { Contact } from '../entities/contact.entity';

export interface ContactRepository extends Repository<Contact> {
  findAll(): Promise<Contact[]>;
}
