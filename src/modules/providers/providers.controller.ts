import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '@guards/jwt.guard';
import { ProvidersService } from './providers.service';
import { DepositDto, WithdrawDto } from './providers.dto';
import { toChecksumAddress } from '../../utils/utils';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get('/transactions')
  @UseGuards(JwtAuthGuard)
  async getTransactions(@Req() req) {
    const { provider } = req;

    return this.providersService.findAllTrxByProviderWalletAddress(
      provider.walletAddress,
    );
  }

  @Post('/deposit')
  async deposit(@Body() body: DepositDto) {
    const providerFound =
      await this.providersService.findProviderByWalletAddress(
        toChecksumAddress(body.providerWalletAddress),
      );

    if (!providerFound) {
      throw new BadRequestException('Provider not found');
    }

    const isTransactionValid =
      await this.providersService.validateProviderTransaction(body);

    if (!isTransactionValid) {
      throw new BadRequestException(
        'FAILED_VALIDATING_DEPOSIT: Deposit transaction could not be validated',
      );
    }

    await this.providersService.createProviderTransaction({
      ...body,
      transactionHash: body.transactionHash.toLowerCase(),
      providerId: providerFound.id,
      providerWalletAddress: providerFound.walletAddress,
      type: 'DEPOSIT',
    });

    return {
      message: 'Successfully created deposit transaction',
    };
  }

  @Post('/withdraw')
  async withdraw(@Body() body: WithdrawDto) {
    const providerFound =
      await this.providersService.findProviderByWalletAddress(
        toChecksumAddress(body.providerWalletAddress),
      );

    if (!providerFound) {
      throw new BadRequestException('Provider not found');
    }

    const isTransactionValid =
      await this.providersService.validateProviderTransaction(body);

    if (!isTransactionValid) {
      throw new BadRequestException(
        'FAILED_VALIDATING_WITHDRAW: Withdraw transaction could not be validated',
      );
    }

    await this.providersService.createProviderTransaction({
      ...body,
      amount: -Number(body.amount),
      transactionHash: body.transactionHash.toLowerCase(),
      providerId: providerFound.id,
      providerWalletAddress: providerFound.walletAddress,
      type: 'WITHDRAW',
    });

    return {
      message: 'Successfully created withdraw transaction',
    };
  }
}
