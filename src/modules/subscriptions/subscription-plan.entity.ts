import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  EntityRepository,
  Repository,
} from 'typeorm';
import { Subscription } from './subscription.entity';

export enum SubscriptionPlanType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'integer' })
  onchainPlanId: number;

  @Column({ nullable: false, type: 'varchar' })
  name: string;

  @Column({ nullable: false, type: 'float' })
  cost: number;

  @Column({ nullable: true, type: 'varchar' })
  transactionHash: string;

  @Column({ nullable: true, type: 'varchar' })
  description: string;

  @Column({ nullable: false, type: 'boolean', default: true })
  isActive: boolean;

  @Column({
    nullable: false,
    type: 'enum',
    enum: SubscriptionPlanType,
    default: SubscriptionPlanType.MONTHLY,
  })
  type: SubscriptionPlanType;

  @OneToMany(
    () => Subscription,
    (subscription) => subscription.subscriptionPlan,
  )
  subscriptions: Subscription[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date | string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date | string;
}

@EntityRepository(SubscriptionPlan)
export class SubscriptionPlanRepository extends Repository<SubscriptionPlan> {}
