import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthTokenTable1729194779384 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        CREATE TABLE "auth_tokens" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "providerId" UUID NOT NULL,
          "providerWalletAddress" varchar NOT NULL,
          "token" VARCHAR UNIQUE NOT NULL,
          "status" VARCHAR DEFAULT 'active',
          "createdAt" timestamptz NOT NULL DEFAULT now(),
          "updatedAt" timestamptz NOT NULL DEFAULT now()
        );
      `,
      undefined,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "auth_tokens_providerWalletAddress_idx" ON auth_tokens("providerWalletAddress", "token");`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "auth_tokens_providerWalletAddress_idx";`,
    );
    await queryRunner.query('DROP TABLE "auth_tokens";', undefined);
  }
}
