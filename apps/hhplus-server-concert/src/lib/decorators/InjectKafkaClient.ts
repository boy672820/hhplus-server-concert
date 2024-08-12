import { Inject } from '@nestjs/common';
import { KAFKA_CLIENT } from '../kafka';

export function InjectKafkaClient(): ParameterDecorator {
  return Inject(KAFKA_CLIENT);
}
