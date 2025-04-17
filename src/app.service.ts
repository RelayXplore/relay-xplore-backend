import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { message: string; environment: string } {
    return {
      message: 'Ok',
      environment: process.env.NODE_ENV,
    };
  }
}
