import { applyDecorators } from '@nestjs/common';
import { PrimaryColumn, PrimaryColumnOptions } from 'typeorm';

export function PrimaryUlid(
  options?: Omit<PrimaryColumnOptions, 'type' | 'length'>,
): PropertyDecorator {
  return applyDecorators(
    PrimaryColumn({
      type: 'char',
      length: 26,
      ...options,
    }),
  );
}
