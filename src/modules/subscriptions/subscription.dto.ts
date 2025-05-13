import { SupportedChain } from '@constants/shared';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SubscriptionPlanType } from './subscription-plan.entity';

export class CreateSubscriptionPlanDto {
  @IsNumber()
  onchainPlanId: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  walletAddress: string;

  @IsString()
  transactionHash: string;

  @IsEnum(SupportedChain)
  chain: SupportedChain = SupportedChain.BSC;

  @IsNumber()
  cost: number;

  @IsEnum(SubscriptionPlanType)
  type: SubscriptionPlanType;
}

export class CreateSubscriptionDto {
  @IsString()
  providerWalletAddress: string;

  @IsString()
  transactionHash: string;

  @IsEnum(SupportedChain)
  chain: SupportedChain = SupportedChain.BSC;

  @IsString()
  subscriptionPlanId: string;

  @IsNumber()
  amount: number;
}
