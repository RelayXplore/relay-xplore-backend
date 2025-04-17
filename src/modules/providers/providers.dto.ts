import { SupportedChain } from '@constants/shared';
import { IsEnum, IsOptional } from 'class-validator';

import { IsNumber } from 'class-validator';

import { IsString } from 'class-validator';

export class DepositDto {
  @IsString()
  providerWalletAddress: string;

  @IsString()
  transactionHash: string;

  @IsEnum(SupportedChain)
  chain: SupportedChain = SupportedChain.BSC;

  @IsNumber()
  amount: number;
}

export class WithdrawDto {
  @IsString()
  providerWalletAddress: string;

  @IsString()
  transactionHash: string;

  @IsEnum(SupportedChain)
  chain: SupportedChain = SupportedChain.BSC;

  @IsNumber()
  amount: number;
}
