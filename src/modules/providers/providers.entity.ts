import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  EntityRepository,
  Repository,
  OneToMany,
} from 'typeorm';
import { OnchainTransaction } from '../onchain-transactions/onchain-transactions.entity';

@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  walletAddress: string;

  @Column({ nullable: true, type: 'varchar' })
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  imageUrl: string;

  @Column({ nullable: true, type: 'varchar' })
  description: string;

  @Column({ nullable: true, type: 'varchar' })
  email: string;

  @OneToMany(
    () => OnchainTransaction,
    (onchainTransaction) => onchainTransaction.provider,
  )
  onchainTransactions: OnchainTransaction[];

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

@EntityRepository(Provider)
export class ProviderRepository extends Repository<Provider> {}
