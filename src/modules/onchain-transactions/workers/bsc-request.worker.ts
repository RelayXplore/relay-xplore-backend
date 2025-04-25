import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { OnchainTransactionsService } from '../onchain-transactions.service';
import logger from '@root/utils/logger';
import {
  OnchainTransaction,
  OnchainTransactionStatus,
} from '../onchain-transactions.entity';
import { Web3Config } from '../../../config/web3/config.web3.initializer';
import { SupportedChain } from '@constants/shared';

@Processor('bsc-chain-request')
export class BscRequestWorker extends WorkerHost {
  constructor(
    private readonly onchainTransactionsService: OnchainTransactionsService,
    private readonly web3Config: Web3Config,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    logger.info(
      `Processing BSC job ${job.id} of data ${JSON.stringify(job.data)}`,
    );

    try {
      const {
        providerWalletAddress,
        fromAddress,
        toAddress,
        data,
        signature,
        nonce,
      } = job.data;

      const { gaslessRelayerContract } = this.web3Config.getWeb3Params(
        SupportedChain.BSC,
      );

      const tx = await gaslessRelayerContract.execute(
        {
          from: fromAddress,
          to: toAddress,
          value: 0n,
          data,
          provider: providerWalletAddress,
          nonce,
        },
        signature,
        {
          gasLimit: 100000,
        },
      );

      await this.onchainTransactionsService.updateByJobId(job.id, {
        transactionHash: tx.hash,
        status: OnchainTransactionStatus.SUCCESS,
      });

      logger.info(
        `BSC Job ${job.id} completed with result: ${JSON.stringify(tx)}`,
      );
    } catch (error) {
      logger.error(
        `Error processing BSC job ${job.id}: ${error.message}`,
        error,
      );
      await this.onchainTransactionsService.updateByJobId(job.id, {
        status: OnchainTransactionStatus.FAILED,
      });
    }
  }
}
