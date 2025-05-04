import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { env } from 'src/constants/env';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthMessage } from './auth-message.entity';
import { AuthToken } from './auth-token.entity';
import { JwtStrategy } from '../../guards/strategies/jwt.strategy';
import { Provider } from '../providers/providers.entity';
import { ProviderTransaction } from '../providers/providers-transactions.entity';
import { ApiKeyService } from '../api_keys/api-key.service';
import { ApiKeyEntity } from '../api_keys/api-key.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthMessage,
      AuthToken,
      Provider,
      ProviderTransaction,
      ApiKeyEntity
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: `${env.JWT_SECRET}`,
      signOptions: { expiresIn: env.JWT_EXPIRATION_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy, ApiKeyService],
  exports: [AuthService],
})
export class AuthModule {}
