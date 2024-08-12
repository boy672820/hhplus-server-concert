import { LocalDateTime } from '@libs/domain/types';
import { LocalDateTimeTransformerPipe } from '../../lib/pipes';
import { ResponseEntity } from '../../lib/response';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  FindEventSchedulesUseCase,
  FindEventsUseCase,
} from '../../application/usecases';
import { EventResponse, ScheduleResponse } from '../dto/responses';

@ApiTags('콘서트')
@Controller('events')
export class EventController {
  constructor(
    private readonly findEventsUseCase: FindEventsUseCase,
    private readonly findEventSchedulesUseCase: FindEventSchedulesUseCase,
  ) {}

  @ApiOperation({
    summary: '이벤트 전체 조회',
    description: '이벤트 전체를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '이벤트 전체 조회 성공',
    type: EventResponse,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<ResponseEntity<EventResponse[]>> {
    const events = await this.findEventsUseCase.execute();
    return ResponseEntity.okWith(events.map(EventResponse.fromModel));
  }

  @ApiOperation({
    summary: '이벤트 스케줄 조회',
    description: '이벤트 스케줄을 조회합니다.',
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
    description: '이벤트 스케줄 조회 성공',
    type: ScheduleResponse,
    isArray: true,
  })
  @Get(':eventId/schedules')
  async findSchedules(
    @Param('eventId') eventId: string,
    @Query('startDate', LocalDateTimeTransformerPipe) startDate: LocalDateTime,
    @Query('endDate', LocalDateTimeTransformerPipe) endDate: LocalDateTime,
  ): Promise<ResponseEntity<ScheduleResponse[]>> {
    const schedules = await this.findEventSchedulesUseCase.execute({
      eventId,
      between: { startDate, endDate },
    });
    return ResponseEntity.okWith(schedules.map(ScheduleResponse.fromModel));
  }
}
