import { Inject } from '@nestjs/common';
import { OUTBOX_SERVICE } from '../outbox.token';

export function InjectOutbox() {
  return Inject(OUTBOX_SERVICE);
}
