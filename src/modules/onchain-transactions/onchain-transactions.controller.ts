import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OnchainTransactionsService } from './onchain-transactions.service';
import {
  GetOnchainTransactionsQuery,
  OnchainTransactionDto,
} from './onchain-transactions.dto';

@Controller('onchain-transactions')
export class OnchainTransactionsController {
  constructor(
    private readonly onchainTransactionsService: OnchainTransactionsService,
  ) {}

  @Get('/:providerWalletAddress')
  async getOnchainTransactions(
    @Param('providerWalletAddress') providerWalletAddress: string,
    @Query() { chain, limit = 50, page = 1 }: GetOnchainTransactionsQuery,
  ) {
    return this.onchainTransactionsService.findOnchainTransactions({
      providerWalletAddress,
      chain,
      limit,
      page,
    });
  }

  @Post()
  async queueRequest(@Body() data: OnchainTransactionDto) {
    return this.onchainTransactionsService.queueRequest(data);
  }

  @Get('/:jobId/job-status')
  async getJobStatus(@Param('jobId') jobId: string) {
    return this.onchainTransactionsService.getJobStatus(jobId);
  }
}
