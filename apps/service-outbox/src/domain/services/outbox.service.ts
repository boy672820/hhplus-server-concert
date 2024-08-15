import { Injectable } from '@nestjs/common';
import { OutboxAdapter } from '../adapters';

@Injectable()
export class OutboxService {
  constructor(private readonly outboxAdapter: OutboxAdapter) {}
}
