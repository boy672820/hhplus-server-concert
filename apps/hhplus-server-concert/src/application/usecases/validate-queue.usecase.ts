import { Injectable } from '@nestjs/common';
import { QueueUser } from '../../domain/models';
import { QueueService } from '../../domain/services';

@Injectable()
export class ValidateQueueUseCase {
  constructor(private readonly queueService: QueueService) {}

  async execute({ token }: { token: string }): Promise<QueueUser> {
    const { userId } = this.queueService.verifyToken(token);
    const user = await this.queueService.checkActive(userId);
    return user;
  }
}
