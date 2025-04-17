import {
  Entity,
  PrimaryGeneratedColumn,
  Repository,
  EntityRepository,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AuthMessageStatus {
  pending = 'pending',
  used = 'used',
  expired = 'expired',
}

@Entity('auth_messages')
export class AuthMessage {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'varchar', nullable: false })
  walletAddress: string;

  @Column({ type: 'varchar', default: AuthMessageStatus.pending })
  status: AuthMessageStatus;

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

@EntityRepository(AuthMessage)
export class AuthMessageRepository extends Repository<AuthMessage> {}
