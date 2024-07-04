import { ResponseEntity } from '@lib/response';
import { Body, Controller, Post } from '@nestjs/common';
import { PaymentResponse } from '../dto/responses';

@Controller('payments')
export class PaymentController {
  @Post()
  pay(@Body() body: any): Promise<any> {
    body;
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
