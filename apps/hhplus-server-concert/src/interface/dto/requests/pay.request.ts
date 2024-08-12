import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PayRequest {
  @ApiProperty({
    example: '1',
    description: '예약 ID',
  })
  @IsString()
  @IsNotEmpty()
  public readonly reservationId: string;
}
