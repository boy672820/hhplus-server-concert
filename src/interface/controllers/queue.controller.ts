import { User } from '@lib/decorators';
import { AuthGuard } from '@lib/guards';
import { ResponseEntity } from '@lib/response';
import { Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignQueueUserUseCase } from '../../application/usecases';
import { TokenResponse } from '../dto/responses';

@ApiTags('대기열 시스템')
@Controller('queue')
export class QueueController {
  constructor(private readonly signQueueUserUseCase: SignQueueUserUseCase) {}

  @ApiOperation({
    summary: '대기열 토큰 생성',
    description: '대기열 토큰을 생성합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '대기열 토큰 생성 성공',
    type: TokenResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('token')
  async generateToken(@User() { userId }: { userId: string }) {
    const { token } = await this.signQueueUserUseCase.execute({ userId });
    return ResponseEntity.okWith(TokenResponse.of(token));
  }
}
