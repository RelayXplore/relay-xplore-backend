import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from './providers.entity';
import { ProviderTransaction } from './providers-transactions.entity';
import { Web3Config } from '@config/web3/config.web3.initializer';

@Module({
  imports: [TypeOrmModule.forFeature([Provider, ProviderTransaction])],
  controllers: [ProvidersController],
  providers: [ProvidersService, Web3Config],
})
export class ProvidersModule {}
