import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  EntityRepository,
  Repository,
} from 'typeorm';

@Entity('providers_transactions')
export class ProviderTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  providerId: string;

  @Column({ nullable: false, type: 'varchar' })
  providerWalletAddress: string;

  @Column({ nullable: false, type: 'varchar' })
  transactionHash: string;

  @Column({ nullable: true, type: 'varchar' })
  chain: string;

  @Column({ nullable: true, type: 'float' })
  amount: number;

  @Column({ nullable: true, type: 'varchar' })
  type: string;

  @Column({ nullable: true, type: 'varchar' })
  email: string;

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

@EntityRepository(ProviderTransaction)
export class ProviderTransactionRepository extends Repository<ProviderTransaction> {}
