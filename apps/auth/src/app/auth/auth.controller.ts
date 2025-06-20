import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  AuthenticateRequest,
  AuthServiceController,
  AuthServiceControllerMethods,
  GrpcLoggingInterceptor,
  User,
} from '@jobber/grpc';
import { UsersService } from '../users/users.service';
import { TokenPayload } from './dto/toke-payload.interface';

@Controller()
@AuthServiceControllerMethods()
@UseInterceptors(GrpcLoggingInterceptor)
export class AuthController implements AuthServiceController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  authenticate(
    request: AuthenticateRequest & { user: TokenPayload }
  ): Promise<User> | Observable<User> | User {
    return this.userService.getUser({ id: request.user.userId });
  }
}
