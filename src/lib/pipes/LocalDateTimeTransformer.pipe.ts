import { BadRequestException, PipeTransform } from '@nestjs/common';
import { LocalDateTime } from '../types';

export class LocalDateTimeTransformerPipe implements PipeTransform {
  transform(value: any) {
    try {
      const localDateTime = LocalDateTime.parse(value);
      return localDateTime;
    } catch (e) {
      throw new BadRequestException('Invalid LocalDateTime format');
    }
  }
}
