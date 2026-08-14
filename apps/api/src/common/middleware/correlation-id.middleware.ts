import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const existingHeader = req.headers['x-correlation-id'];
    const correlationId = (Array.isArray(existingHeader) ? existingHeader[0] : existingHeader) || `corr_${uuidv4()}`;

    req.headers['x-correlation-id'] = correlationId;
    res.setHeader('X-Correlation-ID', correlationId);

    next();
  }
}
