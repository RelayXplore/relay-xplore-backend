import {
  Entity,
  PrimaryGeneratedColumn,
  Repository,
  EntityRepository,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AuthTokenStatus {
  active = 'active',
  pending = 'pending',
  expired = 'expired',
  invalidated = 'invalidated',
}

@Entity('auth_tokens')
export class AuthToken {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ nullable: false, type: 'uuid' })
  providerId: string;

  @Column({ type: 'varchar', nullable: false })
  token: string;

  @Column({ type: 'varchar', nullable: false })
  providerWalletAddress: string;

  @Column({ type: 'varchar', default: AuthTokenStatus.active })
  status: AuthTokenStatus;

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

@EntityRepository(AuthToken)
export class AuthTokenRepository extends Repository<AuthToken> {}
