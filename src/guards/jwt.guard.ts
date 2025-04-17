import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

export const IS_PUBLIC_KEY = 'isPublic';
export const PublicAPI = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')?.[1]?.trim();

    if (!token) {
      throw new HttpException(
        'JWT token is required!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (info?.message === 'jwt malformed') {
      throw new HttpException(
        'JWT token provided is malformed!',
        HttpStatus.FORBIDDEN,
      );
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
