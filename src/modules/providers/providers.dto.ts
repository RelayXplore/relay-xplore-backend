import { SupportedChain } from '@constants/shared';
import { IsEnum, IsNumber, IsString } from 'class-validator';

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
