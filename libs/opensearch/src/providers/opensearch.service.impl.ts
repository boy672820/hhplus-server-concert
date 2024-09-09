import { Inject, Injectable } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { Document, OpenSearchService } from './opensearch.service';
import { OPENSEARCH_CLIENT } from '../opensearch.token';

@Injectable()
export class OpenSearchServiceImpl implements OpenSearchService {
  constructor(@Inject(OPENSEARCH_CLIENT) private readonly client: Client) {}

  async index<T extends Document = Document>(
    index: string,
    document: T,
  ): Promise<T> {
    const body = document;
    await this.client.index({ index, body });
    return body;
  }
}
