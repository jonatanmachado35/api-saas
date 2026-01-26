import { Repository } from '../../../../core/base-classes';
import { Agent } from '../entities/agent.entity';

export interface AgentRepository extends Repository<Agent> {
  findByUserId(userId: string): Promise<Agent[]>;
  findAccessibleByUser(userId: string, userRole: string, userPlan: string): Promise<Agent[]>;
  delete(id: string): Promise<void>;
}
