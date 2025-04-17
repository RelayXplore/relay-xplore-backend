import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthMessageDto, LoginDto } from './auth.dto';
import { isValidAddress, toChecksumAddress } from '../../utils/utils';
import { VerifySignatureGuard } from '../../guards/verifySignature.guard';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/get-nonce')
  async getNonce(@Body() { walletAddress }: CreateAuthMessageDto) {
    if (!isValidAddress(walletAddress)) {
      throw new BadRequestException(
        'Invalid wallet address, only EVM compatible addresses are supported',
      );
    }

    return await this.authService.createAuthMessage(walletAddress);
  }

  @Post('/login')
  @UseGuards(VerifySignatureGuard)
  async login(@Body() { walletAddress }: LoginDto) {
    if (!isValidAddress(walletAddress)) {
      throw new BadRequestException(
        'Invalid wallet address, only EVM compatible addresses are supported',
      );
    }

    return await this.authService.login(toChecksumAddress(walletAddress));
  }

  @Post('/refresh-token')
  @ApiBearerAuth('jwt-token')
  @UseGuards(JwtAuthGuard)
  async refreshAccessToken(@Req() req) {
    const currentAccessToken = req.headers.authorization.split(' ')?.[1];
    return this.authService.refreshAccessToken({
      providerId: req?.user?.providerId,
      currentAccessToken,
    });
  }
}
