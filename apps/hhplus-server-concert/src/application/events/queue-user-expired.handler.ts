import { LoggerService } from '@libs/logger';
import { InjectLogger } from '@libs/logger/decorators';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { QueueUserExpiredEvent } from '../../domain/events';

@EventsHandler(QueueUserExpiredEvent)
export class QueueUserExpiredHandler
  implements IEventHandler<QueueUserExpiredEvent>
{
  constructor(@InjectLogger() private readonly logger: LoggerService) {}

  handle(event: QueueUserExpiredEvent) {
    const { userId } = event;

    this.logger.info('대기열 사용자 만료 처리됨', 'QueueUserExpiredHandler', {
      userId,
    });
  }
}
