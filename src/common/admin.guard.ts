import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { timingSafeEqual } from 'node:crypto';

/**
 * Protects the admin-only contact routes.
 *
 * These endpoints return every submitter's name, email and phone number, and
 * were previously reachable by anyone who knew the URL. The guard fails
 * closed: if ADMIN_SECRET is not configured the routes are denied outright
 * rather than left open, so a missing variable can never silently re-expose
 * the data.
 */
@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const secret = this.config.get<string>('ADMIN_SECRET')?.trim();

    if (!secret) {
      this.logger.error(
        'ADMIN_SECRET is not set — denying access to admin contact routes.',
      );
      throw new UnauthorizedException('Admin access is not configured');
    }

    const req = context.switchToHttp().getRequest<Request>();
    const header = req.header('x-admin-secret');

    if (!header || !this.matches(header.trim(), secret)) {
      throw new UnauthorizedException('Invalid or missing admin credentials');
    }

    return true;
  }

  /** Constant-time compare so the secret can't be guessed byte by byte. */
  private matches(provided: string, expected: string): boolean {
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  }
}
