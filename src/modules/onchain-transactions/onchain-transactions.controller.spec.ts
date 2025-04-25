import { Test, TestingModule } from '@nestjs/testing';
import { OnchainTransactionsController } from './onchain-transactions.controller';
import { OnchainTransactionsService } from './onchain-transactions.service';

describe('OnchainTransactionsController', () => {
  let controller: OnchainTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnchainTransactionsController],
      providers: [OnchainTransactionsService],
    }).compile();

    controller = module.get<OnchainTransactionsController>(OnchainTransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
