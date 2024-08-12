import { BearerGuard } from '../../lib/guards';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ValidateQueueUseCase } from '../../application/usecases';

@Injectable()
export class QueueGuard extends BearerGuard {
  constructor(private readonly validateQueueUseCase: ValidateQueueUseCase) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const token = request.bearer;

    const user = await this.validateQueueUseCase.execute({ token });

    request.user = { userId: user.userId };

    return true;
  }
}
