import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthMessageTable1729194758450 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE TABLE "auth_messages" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "walletAddress" VARCHAR NOT NULL,
          "status" VARCHAR NOT NULL DEFAULT 'pending',
          "createdAt" timestamptz NOT NULL DEFAULT now(),
          "updatedAt" timestamptz NOT NULL DEFAULT now()
        );
      `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "auth_messages";', undefined);
  }
}
