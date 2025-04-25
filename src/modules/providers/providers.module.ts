import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from './providers.entity';
import { ProviderTransaction } from './providers-transactions.entity';
import { Web3Config } from '@config/web3/config.web3.initializer';
import { OnchainTransaction } from '../onchain-transactions/onchain-transactions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Provider,
      ProviderTransaction,
      OnchainTransaction,
    ]),
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService, Web3Config],
})
export class ProvidersModule {}
