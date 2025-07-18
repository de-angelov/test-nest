import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { Packages, AUTH_SERVICE_NAME, AuthServiceClient } from '@jobber/grpc';
import { ClientGrpc } from '@nestjs/microservices';
import { GqlExecutionContext } from '@nestjs/graphql';

// test
@Injectable()
export class GqlAuthGuard implements CanActivate, OnModuleInit {
  private authService!: AuthServiceClient;
  private readonly logger = new Logger(GqlAuthGuard.name);

  constructor(@Inject(Packages.AUTH) private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService(AUTH_SERVICE_NAME);
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const token = this.getRequest(context).cookies?.Authentication;

    if (!token) {
      return false;
    }

    return this.authService.authenticate({ token }).pipe(
      map((res) => {
        this.logger.log(res);
        this.getRequest(context).user = res;
        return true;
      }),
      catchError((err) => {
        this.logger.error(err);
        return of(false);
      })
    );
  }

  private getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
