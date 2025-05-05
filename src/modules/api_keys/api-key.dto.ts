import { IsString } from 'class-validator';

export class ValidateApiKeyDto {
  @IsString()
  key: string;

  @IsString()
  walletAddress: string
}
