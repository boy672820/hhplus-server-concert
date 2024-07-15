import { ExecutionContext, Injectable } from '@nestjs/common';
import { BearerGuard } from './bearer.guard';

@Injectable()
export class AuthGuard extends BearerGuard {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();

    request['user'] = { userId: request.bearer };

    return true;
  }
}
