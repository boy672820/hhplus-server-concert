import { Inject } from '@nestjs/common';
import { KAFKA_CLIENT } from '../kafka';

export function InjectKafkaClient() {
  return Inject(KAFKA_CLIENT);
}
