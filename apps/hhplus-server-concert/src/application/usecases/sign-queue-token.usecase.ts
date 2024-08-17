import { Injectable } from '@nestjs/common';
import { QueueService } from '../../domain/services';

@Injectable()
export class SignQueueUserUseCase {
  constructor(private readonly queueService: QueueService) {}

  async execute({ userId }: { userId: string }): Promise<{ token: string }> {
    const user = await this.queueService.enterUser(userId);
    const token = this.queueService.sign(user);
    return { token };
  }
}
