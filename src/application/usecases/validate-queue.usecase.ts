import { Injectable } from '@nestjs/common';
import { Queue } from '../../domain/models';
import { QueueService } from '../../domain/services';

@Injectable()
export class ValidateQueueUseCase {
  constructor(private readonly queueService: QueueService) {}

  async execute({ token }: { token: string }): Promise<Queue> {
    const parsed = this.queueService.parse(token);
    const user = await this.queueService.verify(parsed);
    return user;
  }
}
