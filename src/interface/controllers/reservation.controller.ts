import { User } from '@lib/decorators';
import { ResponseEntity } from '@lib/response';
import { Controller, Body, Post, UseGuards } from '@nestjs/common';
import { ReservationResponse } from '../dto/responses';
import { ReserveRequest } from '../dto/requests';
import { ReserveUseCase } from '../../application/usecases';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueueGuard } from '../guards';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reserveUseCase: ReserveUseCase) {}

  @ApiOperation({
    summary: '좌석 예약',
    description: '좌석을 예약합니다.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '좌석 예약 성공',
    type: ReservationResponse,
  })
  @UseGuards(QueueGuard)
  @Post()
  async reserve(
    @User() user: { userId: string },
    @Body() body: ReserveRequest,
  ): Promise<ResponseEntity<ReservationResponse>> {
    const reservation = await this.reserveUseCase.execute({
      userId: user.userId,
      seatId: body.seatId,
    });
    return ResponseEntity.okWith(ReservationResponse.fromModel(reservation));
  }
}
