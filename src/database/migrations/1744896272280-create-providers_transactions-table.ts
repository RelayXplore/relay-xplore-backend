import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProvidersTransactionsTable1744896272280
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
              -- Table Definition
                CREATE TABLE "providers_transactions" (
                "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "providerId" UUID NOT NULL,
                "providerWalletAddress" VARCHAR NOT NULL,
                "transactionHash" VARCHAR NOT NULL,
                "chain" VARCHAR,
                "amount" FLOAT,
                "type" VARCHAR,
                "createdAt" timestamptz NOT NULL DEFAULT now(),
                "updatedAt" timestamptz NOT NULL DEFAULT now()
              );`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "providers_transactions";', undefined);
  }
}
