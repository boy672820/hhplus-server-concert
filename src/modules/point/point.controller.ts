import { ResponseEntity } from '@lib/response';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { PointResponse } from './dto/responses';

@Controller('point')
export class PointController {
  @Get()
  my(user: any): Promise<ResponseEntity<PointResponse>> {
    return Promise.resolve(
      ResponseEntity.okWith(PointResponse.of({ balance: '235000' })),
    );
  }

  @Post('charge')
  @HttpCode(HttpStatus.OK)
  charge(
    user: any,
    @Body() { amount }: { amount: number },
  ): Promise<ResponseEntity<PointResponse>> {
    return Promise.resolve(
      ResponseEntity.okWith(PointResponse.of({ balance: '335000' })),
    );
  }
}
