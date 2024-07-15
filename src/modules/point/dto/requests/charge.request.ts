import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal } from 'class-validator';

export class ChargeRequest {
  @ApiProperty({
    description: '충전할 포인트 금액',
    example: '10000',
  })
  @IsDecimal()
  readonly amount: string;
}
