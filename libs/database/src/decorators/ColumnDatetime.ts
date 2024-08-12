import { applyDecorators } from '@nestjs/common';
import { Column, ColumnOptions } from 'typeorm';
import { LocalDateTimeTransformer } from '../../../../apps/hhplus-server-concert/src/lib/utils';

export function ColumnDatetime(
  options?: Omit<ColumnOptions, 'type'>,
): PropertyDecorator {
  return applyDecorators(
    Column({
      type: 'datetime',
      transformer: new LocalDateTimeTransformer(),
      ...options,
    }),
  );
}
