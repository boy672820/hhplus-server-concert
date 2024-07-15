import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReserveRequest {
  @ApiProperty({
    example: '1',
    description: '좌석 ID',
  })
  @IsString()
  @IsNotEmpty()
  public readonly seatId: string;
}
