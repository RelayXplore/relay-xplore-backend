import {
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ApiKeyService } from '../api_keys/api-key.service';
import { AuthMessage, AuthMessageRepository } from './auth-message.entity';
import {
  AuthToken,
  AuthTokenRepository,
  AuthTokenStatus,
} from './auth-token.entity';
import { CreateAuthMessageResponseDto } from './auth.dto';
import { env } from 'src/constants/env';
import { AUTH_MESSAGE } from '@constants/shared';
import { Provider, ProviderRepository } from '../providers/providers.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Provider)
    public readonly providerRepository: ProviderRepository,
    @InjectRepository(AuthMessage)
    public readonly authMessageRepository: AuthMessageRepository,
    @InjectRepository(AuthToken)
    public readonly authTokenRepository: AuthTokenRepository,
    @Inject(forwardRef(() => JwtService))
    public readonly jwtService: JwtService,
    @Inject(forwardRef(() => ApiKeyService))
    public readonly apiKeyService: ApiKeyService,
  ) {}

  async findAccessToken(token: string): Promise<AuthToken> {
    return this.authTokenRepository.findOne({
      where: {
        token,
      },
    });
  }

  async createAuthMessage(
    walletAddress: string,
  ): Promise<CreateAuthMessageResponseDto> {
    const authMessage = await this.authMessageRepository.save({
      walletAddress,
    });
    return {
      authMessage: {
        nonce: authMessage.id,
        walletAddress: authMessage.walletAddress,
        message: `${AUTH_MESSAGE}\n\nWallet address:\n${walletAddress.toLowerCase()}\n\nNonce:\n${
          authMessage.id
        }`,
      },
    };
  }

  async login(walletAddress: string): Promise<{ jwtToken: string }> {
    let foundProvider = await this.providerRepository.findOne({
      where: { walletAddress },
    });

    if (!foundProvider) {
      foundProvider = await this.providerRepository.save({
        walletAddress,
      });

      await this.apiKeyService.create(foundProvider.walletAddress)
    }

    const { jwtToken } = await this.generateJWT(foundProvider);

    return { jwtToken };
  }

  private async generateJWT(provider: Provider): Promise<{ jwtToken: string }> {
    const payload = {
      provider: {
        id: provider.id,
        walletAddress: provider.walletAddress,
        email: provider?.email,
      },
      sub: provider.id,
    };

    const token = this.jwtService.sign(payload, {
      secret: env.JWT_SECRET,
      expiresIn: env.JWT_EXPIRATION_IN,
    });

    await this.authTokenRepository.save({
      providerId: provider.id,
      token,
      status: AuthTokenStatus.active,
      providerWalletAddress: provider.walletAddress,
    });

    return { jwtToken: token };
  }

  async refreshAccessToken({
    providerId,
    currentAccessToken,
  }: {
    providerId: string;
    currentAccessToken: string;
  }): Promise<{ jwtToken: string }> {
    const foundProvider = await this.providerRepository.findOne({
      where: { id: providerId },
    });

    if (!foundProvider) {
      throw new NotFoundException('Provider not found');
    }

    const foundAccessToken = await this.authTokenRepository.findOne({
      where: {
        token: currentAccessToken,
      },
    });

    if (!foundAccessToken) {
      throw new BadRequestException('Invalid JWT Access Token');
    }

    const { jwtToken } = await this.generateJWT(foundProvider);

    await this.authTokenRepository.update(
      {
        id: foundAccessToken.id,
      },
      {
        status: AuthTokenStatus.invalidated,
      },
    );

    return {
      jwtToken,
    };
  }
}
