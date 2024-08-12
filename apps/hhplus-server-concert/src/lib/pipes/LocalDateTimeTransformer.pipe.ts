import { LocalDateTime } from '@libs/domain/types';
import { BadRequestException, PipeTransform } from '@nestjs/common';

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
