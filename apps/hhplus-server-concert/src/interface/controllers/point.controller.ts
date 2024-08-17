import { User } from '../../lib/decorators';
import { AuthGuard } from '../../lib/guards';
import { ResponseEntity } from '../../lib/response';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PointService } from '../../domain/services';
import { ChargeRequest } from '../dto/requests';
import { PointResponse } from '../dto/responses';
import { RechargePointUseCase } from '../../application/usecases';

@ApiTags('포인트')
@Controller('point')
export class PointController {
  constructor(
    private readonly service: PointService,
    private readonly rechargePointUseCase: RechargePointUseCase,
  ) {}

  @ApiOperation({
    summary: '내 포인트 조회',
    description: '내 포인트를 조회합니다.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async my(
    @User() user: { userId: string },
  ): Promise<ResponseEntity<PointResponse>> {
    const point = await this.service.find(user.userId);
    return ResponseEntity.okWith(PointResponse.fromModel(point));
  }

  @ApiOperation({
    summary: '포인트 충전',
    description: '포인트를 충전합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: PointResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('charge')
  @HttpCode(HttpStatus.OK)
  async charge(
    @User() user: { userId: string },
    @Body() { amount }: ChargeRequest,
  ): Promise<ResponseEntity<PointResponse>> {
    const point = await this.rechargePointUseCase.execute({
      userId: user.userId,
      amount,
    });
    return ResponseEntity.okWith(PointResponse.fromModel(point));
  }
}
