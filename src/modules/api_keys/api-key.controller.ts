import { Controller, Post, Body, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { isValidAddress } from '@root/utils/utils';

@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post('update')
  async update(@Body('walletAddress') walletAddress:string) {
    if (!isValidAddress(walletAddress)) {
          throw new BadRequestException(
            'Invalid wallet address, only EVM compatible addresses are supported',
          );
    }
    return this.apiKeyService.update(walletAddress);
  }
}
