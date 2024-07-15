import { ResponseEntity } from '@lib/response';
import { Controller, Get } from '@nestjs/common';
import { FindEventsUseCase } from '../../application/usecases';
import { EventResponse } from '../dto/responses';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('콘서트')
@Controller('events')
export class EventController {
  constructor(private readonly findEventsUseCase: FindEventsUseCase) {}

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
}
