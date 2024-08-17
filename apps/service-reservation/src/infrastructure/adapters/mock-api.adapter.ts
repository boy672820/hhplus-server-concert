import { MockApiService } from '@libs/mock-api';
import { Injectable } from '@nestjs/common';
import { MockApiAdapter } from '../../domain/adapters';

@Injectable()
export class MockApiAdapterImpl extends MockApiAdapter {
  constructor(private readonly mockApiService: MockApiService) {
    super();
  }

  async send(...args: any[]): Promise<void> {
    return this.mockApiService.send(...args);
  }
}
