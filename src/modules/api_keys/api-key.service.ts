import { Injectable, NotFoundException, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKeyEntity } from './api-key.entity';
import { randomUUID } from "crypto"
import { ValidateApiKeyDto } from './api-key.dto';

const plans = {
  basic: {
    limit: 200,
    cost: 0.00
  },
  premium: {
    limit: 5000,
    cost: 0.05
  }, 
  entreprise: {
    limit: 1000000,
    cost: 0.5
  }
}

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private apiKeyRepo: Repository<ApiKeyEntity>,
  ) {}


  async create(walletAddress:string): Promise<ApiKeyEntity> {
    const apiKey = randomUUID()

    const apiKeyData = {
      providerWalletAddress:walletAddress,
      key:apiKey,
      limit:plans.basic.limit,
      currentCount:0
    }
    
    return this.apiKeyRepo.save(apiKeyData);
  }

  async validate(keyData: ValidateApiKeyDto): Promise<boolean> {
    const existingKeyData = await this.apiKeyRepo.findOne({ where: { key:keyData.key, providerWalletAddress:keyData.walletAddress } });
    if (!existingKeyData) {
      throw new NotFoundException('Key not found');
    }

    const incomingCount = existingKeyData.currentCount + 1
    if(incomingCount > existingKeyData.limit) {
      throw new HttpException('API rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
    }
    await this.updateRequestsCount(keyData.walletAddress, incomingCount)
    return true;
  }

  async updateRequestsCount(walletAddress:string, requestCount:number) {
    return await this.apiKeyRepo.update({providerWalletAddress:walletAddress}, {currentCount:requestCount})
  }

  async update(walletAddress:string): Promise<{
    success: boolean;
    message: string;
  }> {
    const newPlan = "premium" // TO DO: Delete 
    const purchasedPlan = plans[newPlan]

    await this.apiKeyRepo.update({providerWalletAddress:walletAddress}, {limit:purchasedPlan.limit})
    return { success: true, message: 'API plan updated successfully.' };
  }
}
