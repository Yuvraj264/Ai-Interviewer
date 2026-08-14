import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private requestCounts = new Map<string, { count: number; resetAt: number }>();
  private readonly windowMs = 60 * 1000; // 1 minute window
  private readonly maxRequests = 120; // 120 req / min limit

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown_client';

    const now = Date.now();
    const clientRecord = this.requestCounts.get(clientIp);

    if (!clientRecord || now > clientRecord.resetAt) {
      this.requestCounts.set(clientIp, { count: 1, resetAt: now + this.windowMs });
      return true;
    }

    if (clientRecord.count >= this.maxRequests) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'RATE_LIMITED',
            message: 'Too many requests. Please slow down and retry in 1 minute.',
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    clientRecord.count++;
    return true;
  }
}
