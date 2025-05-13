import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription, SubscriptionRepository } from './subscription.entity';
import { Web3Config } from '../../config/web3/config.web3.initializer';
import {
  SubscriptionPlan,
  SubscriptionPlanRepository,
  SubscriptionPlanType,
} from './subscription-plan.entity';
import { Provider, ProviderRepository } from '../providers/providers.entity';
import logger from '@root/utils/logger';
import { SupportedChain } from '@constants/shared';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: SubscriptionRepository,
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionPlanRepository: SubscriptionPlanRepository,
    @InjectRepository(Provider)
    private readonly providerRepository: ProviderRepository,
    private readonly web3Config: Web3Config,
  ) {}

  async getSubscriptions(providerWalletAddress: string) {
    return this.subscriptionRepository.find({
      where: {
        providerWalletAddress,
      },
      relations: ['subscriptionPlan'],
    });
  }

  async getSubscriptionPlans() {
    return this.subscriptionPlanRepository.find();
  }

  async validateSubscriptionPlanTransaction(data: {
    transactionHash: string;
    chain: SupportedChain;
    walletAddress: string;
  }) {
    const isReplayAttack = await this.subscriptionPlanRepository.findOne({
      where: {
        transactionHash: data.transactionHash.toLowerCase(),
      },
    });

    if (isReplayAttack) {
      logger.warn('REPLAY_ATTACK_PROTECTION', {
        ...data,
      });
      return false;
    }

    const { subscriptionContractAddress, web3 } = this.web3Config.getWeb3Params(
      data.chain,
    );

    const transactionReceipt = await web3.eth.getTransactionReceipt(
      data.transactionHash.toLowerCase(),
    );
    if (
      !transactionReceipt?.blockHash ||
      !transactionReceipt?.blockNumber ||
      !transactionReceipt?.status
    ) {
      logger.warn('Transaction failed or might still be pending', {
        blockHash: transactionReceipt?.blockHash,
        blockNumber: transactionReceipt?.blockNumber,
        status: transactionReceipt?.status,
      });
      return false;
    }

    if (
      subscriptionContractAddress.toLowerCase() !==
      transactionReceipt?.to.toLowerCase()
    ) {
      logger.warn('Sent to the wrong contract address', {
        to: transactionReceipt?.to,
        from: transactionReceipt?.from,
      });
      return false;
    }

    if (
      transactionReceipt?.from.toLowerCase() !==
      data.walletAddress.toLowerCase()
    ) {
      logger.warn('Account address mismatch', {
        currentAccount: data.walletAddress,
        onchainAccount: transactionReceipt?.from,
      });
      return false;
    }

    return true;
  }

  async validateSubscriptionTransaction(data: {
    transactionHash: string;
    chain: SupportedChain;
    providerWalletAddress: string;
  }) {
    const isReplayAttack = await this.subscriptionRepository.findOne({
      where: {
        transactionHash: data.transactionHash.toLowerCase(),
      },
    });

    if (isReplayAttack) {
      logger.warn('REPLAY_ATTACK_PROTECTION', {
        ...data,
      });
      return false;
    }

    const { subscriptionContractAddress, web3 } = this.web3Config.getWeb3Params(
      data.chain,
    );

    const transactionReceipt = await web3.eth.getTransactionReceipt(
      data.transactionHash.toLowerCase(),
    );
    if (
      !transactionReceipt?.blockHash ||
      !transactionReceipt?.blockNumber ||
      !transactionReceipt?.status
    ) {
      logger.warn('Transaction failed or might still be pending', {
        blockHash: transactionReceipt?.blockHash,
        blockNumber: transactionReceipt?.blockNumber,
        status: transactionReceipt?.status,
      });
      return false;
    }

    if (
      subscriptionContractAddress.toLowerCase() !==
      transactionReceipt?.to.toLowerCase()
    ) {
      logger.warn('Sent to the wrong contract address', {
        to: transactionReceipt?.to,
        from: transactionReceipt?.from,
      });
      return false;
    }

    if (
      transactionReceipt?.from.toLowerCase() !==
      data.providerWalletAddress.toLowerCase()
    ) {
      logger.warn('Account address mismatch', {
        currentAccount: data.providerWalletAddress,
        onchainAccount: transactionReceipt?.from,
      });
      return false;
    }

    return true;
  }

  async createSubscriptionPlan(subscriptionPlan: Partial<SubscriptionPlan>) {
    const subscriptionPlanFound = await this.subscriptionPlanRepository.findOne(
      {
        where: {
          onchainPlanId: subscriptionPlan.onchainPlanId,
        },
      },
    );

    if (subscriptionPlanFound) {
      throw new BadRequestException(
        `Subscription plan with onchainPlanId ${subscriptionPlan.onchainPlanId} already exists`,
      );
    }

    return this.subscriptionPlanRepository.save({
      ...subscriptionPlan,
      transactionHash: subscriptionPlan.transactionHash.toLowerCase(),
    });
  }

  async createSubscription(subscription: Partial<Subscription>) {
    const subscriptionPlanFound = await this.subscriptionPlanRepository.findOne(
      {
        where: {
          id: subscription.subscriptionPlanId,
        },
      },
    );

    if (!subscriptionPlanFound) {
      throw new NotFoundException(
        `Subscription plan with id ${subscription.subscriptionPlanId} not found`,
      );
    }

    const providerFound = await this.providerRepository.findOne({
      where: {
        walletAddress: subscription.providerWalletAddress,
      },
    });

    if (!providerFound) {
      throw new NotFoundException(
        `Provider with wallet address ${subscription.providerWalletAddress} not found`,
      );
    }

    return this.subscriptionRepository.save({
      ...subscription,
      providerId: providerFound.id,
      subscriptionPlanId: subscriptionPlanFound.id,
      providerWalletAddress: subscription.providerWalletAddress,
      transactionHash: subscription.transactionHash.toLowerCase(),
      startAt: new Date(),
      endAt:
        subscriptionPlanFound.type === SubscriptionPlanType.MONTHLY
          ? new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
          : new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
    });
  }
}
