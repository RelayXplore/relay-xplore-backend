import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SupportedChain } from '@constants/shared';

export class GetOnchainTransactionsQuery {
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsEnum(SupportedChain)
  @IsOptional()
  chain?: SupportedChain = SupportedChain.BSC;
}

export class OnchainTransactionDto {
  @IsString()
  providerWalletAddress: string;

  @IsString()
  fromAddress: string;

  @IsString()
  toAddress: string;

  @IsString()
  signature: string;

  @IsString()
  data: string;

  @IsNumber()
  nonce: number;

  @IsEnum(SupportedChain)
  chain: SupportedChain = SupportedChain.BSC;
}
