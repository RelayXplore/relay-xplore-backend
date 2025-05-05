import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNameAndIsActiveFromApiKey1746357313747 implements MigrationInterface {

      public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_keys" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "api_keys" DROP COLUMN "isActive"`);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_keys" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "api_keys" ADD "isActive" boolean NOT NULL DEFAULT true`);
      }

}
