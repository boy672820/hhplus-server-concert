import { Controller, Get, Inject, Res } from '@nestjs/common';
import { REGISTER_PROVIDER } from './prometheus.token';
import { Registry } from 'prom-client';
import { Response } from 'express';

@Controller()
export class PrometheusController {
  constructor(@Inject(REGISTER_PROVIDER) private readonly register: Registry) {}

  @Get('metrics')
  async getMetrics(@Res() response: Response) {
    const metrics = await this.register.metrics();
    response.set('Content-Type', this.register.contentType);
    response.send(metrics);
  }
}
