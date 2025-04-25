import { Test, TestingModule } from '@nestjs/testing';
import { OnchainTransactionsService } from './onchain-transactions.service';

describe('OnchainTransactionsService', () => {
  let service: OnchainTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnchainTransactionsService],
    }).compile();

    service = module.get<OnchainTransactionsService>(
      OnchainTransactionsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
