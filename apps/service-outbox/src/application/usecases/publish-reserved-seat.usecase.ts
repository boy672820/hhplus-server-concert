import { Injectable } from '@nestjs/common';
import { OutboxService } from '../../domain/services';

@Injectable()
export class PublishReservedSeatUseCase {
  constructor(private readonly outboxService: OutboxService) {}

  async execute(): Promise<void> {
    await this.outboxService.createTransaction();
  }
}
