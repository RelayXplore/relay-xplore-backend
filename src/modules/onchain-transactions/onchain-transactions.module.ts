import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { OnchainTransactionsService } from './onchain-transactions.service';
import { OnchainTransactionsController } from './onchain-transactions.controller';
import { BscRequestWorker } from './workers/bsc-request.worker';
import { ProviderTransaction } from '../providers/providers-transactions.entity';
import { Provider } from '../providers/providers.entity';
import { OnchainTransaction } from './onchain-transactions.entity';
import { Web3Config } from '@config/web3/config.web3.initializer';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Provider,
      ProviderTransaction,
      OnchainTransaction,
    ]),
    BullModule.registerQueue({
      name: 'bsc-chain-request',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
      },
    }),
  ],
  controllers: [OnchainTransactionsController],
  providers: [OnchainTransactionsService, BscRequestWorker, Web3Config],
})
export class OnchainTransactionsModule {}
