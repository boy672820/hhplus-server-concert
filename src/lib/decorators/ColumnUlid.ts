import { applyDecorators } from '@nestjs/common';
import { Column, ColumnOptions } from 'typeorm';

export function ColumnUlid(
  options?: Omit<ColumnOptions, 'type' | 'length'>,
): PropertyDecorator {
  return applyDecorators(
    Column({
      type: 'char',
      length: 26,
      ...options,
    }),
  );
}
