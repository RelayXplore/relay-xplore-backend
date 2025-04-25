import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  EntityRepository,
  Repository,
  ManyToOne,
} from 'typeorm';
import { Provider } from '../providers/providers.entity';

export enum OnchainTransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Entity('onchain_transactions')
export class OnchainTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  providerId: string;

  @Column({ nullable: false, type: 'varchar' })
  providerWalletAddress: string;

  @Column({ nullable: false, type: 'varchar' })
  fromAddress: string;

  @Column({ nullable: false, type: 'varchar' })
  toAddress: string;

  @Column({ nullable: true, type: 'varchar' })
  nonce: string;

  @Column({ nullable: true, type: 'varchar' })
  transactionHash: string;

  @Column({ nullable: true, type: 'varchar' })
  chain: string;

  @Column({ nullable: true, type: 'float' })
  gasUsed: number;

  @Column({ nullable: false, type: 'varchar' })
  status: OnchainTransactionStatus;

  @Column({ nullable: true, type: 'varchar' })
  jobId: string;

  @Column({ nullable: true, type: 'varchar' })
  signature: string;

  @Column({ nullable: true, type: 'text' })
  data: string;

  @ManyToOne(() => Provider, (provider) => provider.onchainTransactions)
  provider: Provider;

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

@EntityRepository(OnchainTransaction)
export class OnchainTransactionRepository extends Repository<OnchainTransaction> {}
