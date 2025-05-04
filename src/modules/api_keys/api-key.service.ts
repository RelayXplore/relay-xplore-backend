import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKeyEntity } from './api-key.entity';
import { randomUUID } from "crypto"

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
      name: walletAddress,
      isActive:true,
      limit:plans.basic.limit,
      currentCount:0
    }
    
    return this.apiKeyRepo.save(apiKeyData);
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

  async validate(key: string): Promise<boolean> {
    const existingKeyData = await this.apiKeyRepo.findOne({ where: { key } });
    return !!existingKeyData.isActive;
  }
}
