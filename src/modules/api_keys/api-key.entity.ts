import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('api_keys')
export class ApiKeyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  providerWalletAddress: string;

  @Column({ type: 'varchar', unique: true })
  key: string;

  @Column({ type: 'int', nullable: false })
  limit: number;

  @Column({ type: 'int', nullable: false })
  currentCount: number;

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
