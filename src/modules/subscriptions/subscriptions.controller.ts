import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import {
  CreateSubscriptionDto,
  CreateSubscriptionPlanDto,
} from './subscription.dto';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('/:providerWalletAddress')
  async getSubscriptions(
    @Param('providerWalletAddress') providerWalletAddress: string,
  ) {
    return this.subscriptionsService.getSubscriptions(providerWalletAddress);
  }

  @Get('/subscription-plans')
  async getSubscriptionPlans() {
    return this.subscriptionsService.getSubscriptionPlans();
  }

  @Post('')
  async createSubscription(@Body() subscription: CreateSubscriptionDto) {
    const isValid =
      await this.subscriptionsService.validateSubscriptionTransaction(
        subscription,
      );

    if (!isValid) {
      throw new BadRequestException(
        'FAILED_VALIDATING_SUBSCRIPTION: Subscription transaction could not be validated',
      );
    }

    await this.subscriptionsService.createSubscription(subscription);

    return {
      message: 'Successfully created subscription',
    };
  }

  @Post('/subscription-plan')
  async createSubscriptionPlan(
    @Body() subscriptionPlan: CreateSubscriptionPlanDto,
  ) {
    const isValid =
      await this.subscriptionsService.validateSubscriptionPlanTransaction(
        subscriptionPlan,
      );

    if (!isValid) {
      throw new BadRequestException(
        'FAILED_VALIDATING_SUBSCRIPTION_PLAN: Subscription plan transaction could not be validated',
      );
    }

    await this.subscriptionsService.createSubscriptionPlan(subscriptionPlan);

    return {
      message: 'Successfully created subscription plan',
    };
  }
}
