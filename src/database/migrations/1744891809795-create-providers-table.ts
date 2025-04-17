import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProvidersTable1744891809795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
              -- Table Definition
                CREATE TABLE "providers" (
                "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "walletAddress" VARCHAR NOT NULL UNIQUE,
                "name" VARCHAR,
                "imageUrl" VARCHAR,
                "description" VARCHAR,
                "email" VARCHAR,
                "createdAt" timestamptz NOT NULL DEFAULT now(),
                "updatedAt" timestamptz NOT NULL DEFAULT now()
              );
            `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "providers";', undefined);
  }
}
