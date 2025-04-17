import 'dotenv/config';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ethers } from 'ethers';
import dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuthMessage,
  AuthMessageRepository,
  AuthMessageStatus,
} from '../modules/auth/auth-message.entity';
import { env } from '../constants/env';
import { LoginDto } from '../modules/auth/auth.dto';
import { AUTH_MESSAGE } from '../constants/shared';

@Injectable()
export class VerifySignatureGuard implements CanActivate {
  constructor(
    @InjectRepository(AuthMessage)
    private readonly authMessageRepository: AuthMessageRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [req] = context.getArgs();
    const { body } = req;
    const { signature, nonce, walletAddress } = body as LoginDto;

    if (!signature) {
      throw new BadRequestException('Signature is required');
    }
    const foundMessage = await this.authMessageRepository.findOne({
      where: {
        id: nonce,
      },
    });

    if (!foundMessage || foundMessage.status !== AuthMessageStatus.pending) {
      throw new BadRequestException('Invalid wallet signature message');
    }

    if (
      foundMessage.walletAddress.toLowerCase() !== walletAddress.toLowerCase()
    ) {
      throw new BadRequestException(
        'Wallet address does not match the signature message',
      );
    }

    if (
      dayjs(foundMessage?.createdAt).isBefore(
        dayjs().subtract(env.SIGNATURE_GUARD_TIMEOUT_SECONDS, 'seconds'),
      )
    ) {
      await this.authMessageRepository.update(foundMessage.id, {
        status: AuthMessageStatus.expired,
      });

      throw new UnauthorizedException('Signature has expired');
    }

    if (foundMessage.status !== AuthMessageStatus.pending) {
      throw new UnauthorizedException(
        `Message has already been ${foundMessage.status}`,
      );
    }

    let signerWalletAddress: string;

    try {
      signerWalletAddress = this.verifySignature({
        signature,
        walletAddress,
        nonce,
      });
    } catch (error) {
      throw new BadRequestException('Failed to verify signature');
    }

    if (
      !signerWalletAddress ||
      signerWalletAddress?.toLowerCase() !== walletAddress?.toLowerCase()
    ) {
      throw new BadRequestException('Invalid signature provided');
    }

    await this.authMessageRepository.update(foundMessage.id, {
      status: AuthMessageStatus.used,
    });

    return true;
  }

  verifySignature({
    signature,
    walletAddress,
    nonce,
  }: {
    signature: string;
    walletAddress: string;
    nonce: string;
  }): string {
    const message = `${AUTH_MESSAGE}\n\nWallet address:\n${walletAddress.toLowerCase()}\n\nNonce:\n${nonce}`;
    const messageHash = ethers.hashMessage(message);
    const recoveredAddress = ethers.recoverAddress(messageHash, signature);
    return recoveredAddress;
  }
}
