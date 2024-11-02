import { Module } from '@nestjs/common';
import { JWTModule } from '@tcg-market-core/jwt';

import { AuthenticationService } from './authentication/authentication.service';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthorizationService } from './authorization/authorization.service';
import { AuthorizationController } from './authorization/authorization.controller';

@Module({
  imports: [UserModule],
  providers: [AuthenticationService, AuthorizationService],
  controllers: [AuthenticationController, AuthorizationController],
})
export class AuthModule {}
