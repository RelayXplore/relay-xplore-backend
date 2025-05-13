import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';
import { Subscription } from './subscription.entity';
import { Provider } from '../providers/providers.entity';
import { Web3Config } from '@config/web3/config.web3.initializer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, SubscriptionPlan, Provider]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, Web3Config],
})
export class SubscriptionsModule {}
