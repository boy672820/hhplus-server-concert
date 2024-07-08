import { applyDecorators } from '@nestjs/common';
import { Column, ColumnOptions } from 'typeorm';

export function ColumnDatetime(
  options?: Omit<ColumnOptions, 'type'>,
): PropertyDecorator {
  return applyDecorators(Column({ type: 'datetime', ...options }));
}
