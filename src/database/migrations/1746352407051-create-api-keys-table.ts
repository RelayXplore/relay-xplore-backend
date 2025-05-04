import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApiKeysTable1746352407051 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `
            CREATE TABLE "api_keys" (
              "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              "providerWalletAddress" VARCHAR NOT NULL,
              "name" VARCHAR NOT NULL,
              "key" VARCHAR UNIQUE NOT NULL,
              "limit" INTEGER NOT NULL,
              "currentCount" INTEGER NOT NULL,
              "isActive" BOOLEAN NOT NULL,
              "createdAt" timestamptz NOT NULL DEFAULT now(),
              "updatedAt" timestamptz NOT NULL DEFAULT now()
            );
          `,
          undefined,
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "api_keys";', undefined);
      }

}
