import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { BullModule } from '@nestjs/bullmq';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { OnchainTransactionsModule } from './modules/onchain-transactions/onchain-transactions.module';

const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  ttl: Number(process.env.RATE_LIMIT_TTL_SECONDS) || 60,
};

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      ...redisOptions,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number(),
        NODE_ENV: Joi.string()
          .valid('test', 'development', 'production')
          .required(),
        NETWORK: Joi.string().valid('testnet', 'mainnet').optional(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
    BullModule.forRoot({
      connection: {
        host: redisOptions.host,
        port: redisOptions.port,
      },
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    AuthModule,
    ProvidersModule,
    OnchainTransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
