import { MigrationInterface, QueryRunner } from 'typeorm';
import { SubscriptionPlanType } from '../../modules/subscriptions/subscription-plan.entity';

export class CreateSubscriptionPlansTable1747173311335
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
                    -- Table Definition
                    CREATE TABLE "subscription_plans" (
                    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    "onchainPlanId" INTEGER NOT NULL,
                    "name" VARCHAR NOT NULL UNIQUE,
                    "cost" FLOAT NOT NULL,
                    "transactionHash" VARCHAR,
                    "description" VARCHAR,
                    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
                    "type" VARCHAR CHECK ("type" IN ('${SubscriptionPlanType.MONTHLY}', '${SubscriptionPlanType.YEARLY}')) NOT NULL DEFAULT '${SubscriptionPlanType.MONTHLY}',
                    "createdAt" timestamptz NOT NULL DEFAULT now(),
                    "updatedAt" timestamptz NOT NULL DEFAULT now()
                    );
                  `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "subscription_plans";', undefined);
  }
}
