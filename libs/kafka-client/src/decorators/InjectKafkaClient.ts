import { Inject } from '@nestjs/common';
import { KAFKA_CLIENT } from '../kafka-client.token';

export function InjectKafkaClient() {
  return Inject(KAFKA_CLIENT);
}
