import { LocalDateTime, SeatStatus } from '@lib/types';
import { LocalDateTimeTransformerPipe } from '@lib/pipes';
import { ResponseEntity } from '@lib/response';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ScheduleResponse, SeatResponse } from '../dto/responses';
import { FindSchedulesBetweenUseCase } from '../../application/usecases';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('콘서트 일정')
@Controller('schedules')
export class ScheduleController {
  constructor(
    private readonly findSchedulesBetweenUseCase: FindSchedulesBetweenUseCase,
  ) {}

  @ApiOperation({
    summary: '예약가능 일정 조회',
    description: '예약 가능한 일정을 조회합니다.',
  })
  @ApiQuery({
    name: 'startDate',
    description: '조회 시작 날짜',
    required: true,
    type: String,
    example: '2021-01-01T00:00:00',
  })
  @ApiQuery({
    name: 'endDate',
    description: '조회 종료 날짜',
    required: true,
    type: String,
    example: '2021-01-01T23:59:59',
  })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: ScheduleResponse,
    isArray: true,
  })
  @Get()
  async findBetween(
    @Query('startDate', LocalDateTimeTransformerPipe) startDate: LocalDateTime,
    @Query('endDate', LocalDateTimeTransformerPipe) endDate: LocalDateTime,
  ): Promise<ResponseEntity<ScheduleResponse[]>> {
    const schedules = await this.findSchedulesBetweenUseCase.execute({
      startDate,
      endDate,
    });
    return ResponseEntity.okWith(schedules.map(ScheduleResponse.fromModel));
  }

  @Get(':scheduleId/seats')
  findSeats(
    @Param('scheduleId') scheduleId: string,
  ): Promise<ResponseEntity<SeatResponse[]>> {
    return Promise.resolve(
      ResponseEntity.okWith(
        Array.from({ length: 10 }, (_, index) =>
          SeatResponse.of({
            id: index.toString(),
            number: index + 1,
            status: SeatStatus.Pending,
          }),
        ),
      ),
    );
  }
}
