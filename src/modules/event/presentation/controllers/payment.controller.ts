import { ResponseEntity } from '@lib/response';
import { Body, Controller, Post } from '@nestjs/common';
import { PaymentResponse } from '../dto/responses';

@Controller('payments')
export class PaymentController {
  @Post()
  pay(
    user: { userId: string },
    @Body() { reservationId }: { reservationId: string },
  ): Promise<any> {
    return Promise.resolve(
      ResponseEntity.okWith(
        PaymentResponse.of({
          reservationId: '1',
          amount: '220000',
          createdDate: new Date(),
        }),
      ),
    );
  }
}
