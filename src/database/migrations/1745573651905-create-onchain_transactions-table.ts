import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOnchainTransactionsTable1745573651905
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      -- Table Definition
            CREATE TABLE "onchain_transactions" (
            "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "providerId" UUID NOT NULL,
            "providerWalletAddress" VARCHAR NOT NULL,
            "fromAddress" VARCHAR NOT NULL,
            "toAddress" VARCHAR NOT NULL,
            "nonce" VARCHAR,
            "transactionHash" VARCHAR,
            "signature" VARCHAR,
            "data" TEXT,
            "chain" VARCHAR,
            "gasUsed" FLOAT,
            "status" VARCHAR,
            "jobId" VARCHAR NOT NULL UNIQUE,
            "createdAt" timestamptz NOT NULL DEFAULT now(),
            "updatedAt" timestamptz NOT NULL DEFAULT now()
    );`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "onchain_transactions";', undefined);
  }
}
