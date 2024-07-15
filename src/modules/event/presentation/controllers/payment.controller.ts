import { User } from '@lib/decorators';
import { ResponseEntity } from '@lib/response';
import { Body, Controller, Post } from '@nestjs/common';
import { PaymentResponse } from '../dto/responses';
import { PayReservationUseCase } from '../../application/usecases';
import { PayRequest } from '../dto/requests';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('결제 정보')
@Controller('payments')
export class PaymentController {
  constructor(private readonly payReservationUseCase: PayReservationUseCase) {}

  @ApiOperation({
    summary: '예약 결제',
    description: '예약된 좌석을 결제합니다.',
  })
  @ApiResponse({
    status: 200,
    type: PaymentResponse,
    description: '결제 정보',
  })
  @Post()
  async pay(
    @User() user: { userId: string },
    @Body() body: PayRequest,
  ): Promise<ResponseEntity<PaymentResponse>> {
    const payment = await this.payReservationUseCase.execute({
      reservationId: body.reservationId,
      userId: user.userId,
    });
    return ResponseEntity.okWith(PaymentResponse.fromModel(payment));
  }
}
