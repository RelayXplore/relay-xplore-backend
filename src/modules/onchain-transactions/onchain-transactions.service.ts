import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  OnchainTransaction,
  OnchainTransactionStatus,
} from './onchain-transactions.entity';
import { OnchainTransactionRepository } from './onchain-transactions.entity';
import { Provider, ProviderRepository } from '../providers/providers.entity';
import { OnchainTransactionDto } from './onchain-transactions.dto';
import { toChecksumAddress } from '../../utils/utils';
import { Web3Config } from '@config/web3/config.web3.initializer';
import { SupportedChain } from '@constants/shared';
import { IsNull } from 'typeorm';
import { Not } from 'typeorm';

@Injectable()
export class OnchainTransactionsService {
  constructor(
    @InjectRepository(OnchainTransaction)
    private onchainTransactionRepository: OnchainTransactionRepository,
    @InjectRepository(Provider)
    private readonly providerRepository: ProviderRepository,
    @InjectQueue('bsc-chain-request') private bscQueue: Queue,
    private readonly web3Config: Web3Config,
  ) {}

  findByJobId(jobId: string) {
    return this.onchainTransactionRepository.findOne({
      where: { jobId },
    });
  }

  updateByJobId(jobId: string, data: Partial<OnchainTransaction>) {
    return this.onchainTransactionRepository.update({ jobId }, data);
  }

  async findOnchainTransactions({
    page,
    limit,
    providerWalletAddress,
    chain,
  }: {
    page: number;
    limit: number;
    providerWalletAddress: string;
    chain?: SupportedChain;
  }): Promise<any> {
    const take = limit;
    const skip = (page - 1) * take;

    const where: any = {
      jobId: Not(IsNull()),
      providerWalletAddress: toChecksumAddress(providerWalletAddress),
    };

    if (chain) {
      where.chain = chain;
    }

    const [onchainTransactions, totalOnchainTransactions] =
      await this.onchainTransactionRepository.findAndCount({
        relations: ['provider'],
        order: {
          id: 'DESC',
        },
        where,
        take,
        skip,
      });

    return {
      onchainTransactions,
      meta: {
        limit,
        currentPage: page,
        totalPages: Math.ceil(totalOnchainTransactions / take),
        totalOnchainTransactions,
      },
    };
  }

  async submitRequest(data: OnchainTransactionDto) {
    const providerFound = await this.providerRepository.findOne({
      where: { walletAddress: toChecksumAddress(data.providerWalletAddress) },
    });

    if (!providerFound) {
      throw new Error('Provider not found');
    }

    const { gaslessRelayerContract } = this.web3Config.getWeb3Params(
      data.chain,
    );

    const isValid = await gaslessRelayerContract.verify(
      {
        from: data.fromAddress,
        to: data.toAddress,
        value: 0n,
        data: data.data,
        provider: data.providerWalletAddress,
        nonce: data.nonce,
      },
      data.signature,
    );

    if (!isValid) {
      throw new Error('Invalid signature');
    }

    const job = await this.bscQueue.add('process-bsc-request', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });

    const onchainTransaction = await this.onchainTransactionRepository.save({
      ...data,
      providerId: providerFound.id,
      providerWalletAddress: providerFound.walletAddress,
      nonce: data.nonce.toString(),
      status: OnchainTransactionStatus.PENDING,
      jobId: job.id,
    });

    return { ...onchainTransaction, jobId: job.id };
  }

  async getJobStatus(jobId: string) {
    const job = await this.bscQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const state = await job.getState();
    const result = job.returnvalue;

    return {
      id: job.id,
      status: state,
      result: result || null,
      failedReason: job.failedReason,
      progress: job.progress,
    };
  }
}
