import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProviderTransaction,
  ProviderTransactionRepository,
} from './providers-transactions.entity';
import { DepositDto, WithdrawDto } from './providers.dto';
import { Web3Config } from '../../config/web3/config.web3.initializer';
import logger from '@root/utils/logger';
import { Provider, ProviderRepository } from './providers.entity';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(ProviderTransaction)
    private readonly providerTransactionRepository: ProviderTransactionRepository,
    @InjectRepository(Provider)
    private readonly providerRepository: ProviderRepository,
    private readonly web3Config: Web3Config,
  ) {}

  findProviderByWalletAddress(walletAddress: string) {
    return this.providerRepository.findOne({
      where: {
        walletAddress,
      },
    });
  }

  async createProviderTransaction(
    providerTransaction: Partial<ProviderTransaction>,
  ) {
    return this.providerTransactionRepository.save(providerTransaction);
  }

  findAllTrxByProviderWalletAddress(walletAddress: string) {
    return this.providerTransactionRepository.find({
      where: {
        providerWalletAddress: walletAddress,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async validateProviderTransaction(data: DepositDto | WithdrawDto) {
    const isReplayAttack = await this.providerTransactionRepository.findOne({
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

    const { gaslessRelayerContractAddress, web3 } =
      this.web3Config.getWeb3Params(data.chain);

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
      gaslessRelayerContractAddress.toLowerCase() !==
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
}
