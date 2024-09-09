import { Inject } from '@nestjs/common';
import { OPENSEARCH } from '../opensearch.token';

export function InjectOpenSearch() {
  return Inject(OPENSEARCH);
}
