import { LoggerService } from '@libs/logger';
import { InjectLogger } from '@libs/logger/decorators';
import { Injectable } from '@nestjs/common';
import { QueueService } from '../../domain/services';

@Injectable()
export class SignQueueUserUseCase {
  constructor(
    private readonly queueService: QueueService,
    @InjectLogger() private readonly logger: LoggerService,
  ) {}

  async execute({ userId }: { userId: string }): Promise<{ token: string }> {
    const user = await this.queueService.enterUser(userId);
    const token = this.queueService.sign(user);

    this.logger.info('대기열 토큰 발행됨', 'SignQueueUserUseCase', {
      userId,
    });

    return { token };
  }
}
