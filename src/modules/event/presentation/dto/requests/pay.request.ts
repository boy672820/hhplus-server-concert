import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsString } from 'class-validator';

export class PayRequest {
  @ApiProperty({
    example: '1',
    description: '예약 ID',
  })
  @IsString()
  @IsEmpty()
  public readonly reservationId: string;
}
