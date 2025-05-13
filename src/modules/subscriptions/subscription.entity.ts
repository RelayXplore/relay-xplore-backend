import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  EntityRepository,
  Repository,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Provider } from '../providers/providers.entity';
import { SubscriptionPlan } from './subscription-plan.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Provider, (provider) => provider.subscriptions)
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  @ManyToOne(
    () => SubscriptionPlan,
    (subscriptionPlan) => subscriptionPlan.subscriptions,
  )
  @JoinColumn({ name: 'subscriptionPlanId' })
  subscriptionPlan: SubscriptionPlan;

  @Column({ nullable: false, type: 'uuid' })
  subscriptionPlanId: string;

  @Column({ nullable: false, type: 'varchar' })
  providerWalletAddress: string;

  @Column({ nullable: true, type: 'varchar' })
  transactionHash: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({ nullable: false, type: 'float' })
  amount: number;

  @Column({ nullable: false, type: 'timestamp' })
  startAt: Date;

  @Column({ nullable: false, type: 'timestamp' })
  endAt: Date;

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

@EntityRepository(Subscription)
export class SubscriptionRepository extends Repository<Subscription> {}
