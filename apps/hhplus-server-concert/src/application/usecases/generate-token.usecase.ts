import { Injectable } from '@nestjs/common';
import { QueueService } from '../../domain/services';

@Injectable()
export class GenerateTokenUsecase {
  constructor(private readonly queueService: QueueService) {}

  async execute({ userId }: { userId: string }): Promise<any> {
    const queue = await this.queueService.enqueue(userId);
    const token = this.queueService.sign(queue);
    return token;
  }
}
