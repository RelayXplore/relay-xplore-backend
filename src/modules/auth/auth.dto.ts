import { Type } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class AuthRefreshAccessTokenResponseDto {
  @IsString()
  jwtToken: string;
}

export class CreateAuthMessageDto {
  @IsString()
  walletAddress: string;
}

export class LoginDto {
  @IsString()
  walletAddress: string;

  @IsString()
  nonce: string;

  @IsString()
  signature: string;

  @IsNumber()
  chainId: number;

  @IsString()
  @IsOptional()
  accessCode?: string;
}

export class CreateAuthMessageSchemaDto {
  @IsString()
  nonce: string;

  @IsString()
  walletAddress: string;

  @IsString()
  message: string;
}

export class CreateAuthMessageResponseDto {
  @Type(() => CreateAuthMessageSchemaDto)
  authMessage: CreateAuthMessageSchemaDto;
}
