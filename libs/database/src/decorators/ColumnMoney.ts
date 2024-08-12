import { Column, ColumnOptions } from 'typeorm';
import { DecimalTransformer } from '../../../../apps/hhplus-server-concert/src/lib/utils';

export function ColumnMoney(
  options?: Omit<ColumnOptions, 'type' | 'precision' | 'scale'>,
): PropertyDecorator {
  return Column({
    ...options,
    type: 'decimal',
    default: 0,
    precision: 10,
    scale: 2,
    transformer: new DecimalTransformer(),
  });
}
