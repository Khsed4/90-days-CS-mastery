import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { USER_REPOSITORY } from './repositories/user.repository.interface';
import { MysqlUserRepository } from './repositories/mysql-user.repository';
import { EMAIL_VERIFICATION_REPOSITORY } from './repositories/email-verification.repository.interface';
import { MysqlEmailVerificationRepository } from './repositories/mysql-email-verification.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'super-secret-jwt-key-90days-mastery-app'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '7d'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: MysqlUserRepository,
    },
    {
      provide: EMAIL_VERIFICATION_REPOSITORY,
      useClass: MysqlEmailVerificationRepository,
    },
  ],
  exports: [AuthService, USER_REPOSITORY],
})
export class AuthModule {}
