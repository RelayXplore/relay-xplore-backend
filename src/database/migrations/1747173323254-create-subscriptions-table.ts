import { MigrationInterface, QueryRunner } from 'typeorm';
import { SubscriptionStatus } from '../../modules/subscriptions/subscription.entity';

export class CreateSubscriptionsTable1747173323254
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE "subscriptions" (
            "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            "providerId" UUID NOT NULL,
            "subscriptionPlanId" UUID NOT NULL,
            "providerWalletAddress" VARCHAR NOT NULL,
            "transactionHash" VARCHAR,
            "status" VARCHAR CHECK ("status" IN ('${SubscriptionStatus.ACTIVE}', '${SubscriptionStatus.CANCELLED}')) NOT NULL DEFAULT '${SubscriptionStatus.ACTIVE}',
            "amount" FLOAT,
            "startAt" timestamptz NOT NULL,
            "endAt" timestamptz NOT NULL,
            "createdAt" timestamptz NOT NULL DEFAULT now(),
            "updatedAt" timestamptz NOT NULL DEFAULT now()
            );  
            `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "subscriptions";', undefined);
  }
}
