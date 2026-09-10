import { Injectable, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }
    if (!user.isEmailVerified) {
      throw new ForbiddenException('Email verification required. Please verify your email to access this resource.');
    }
    return user;
  }
}
