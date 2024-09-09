import { Provider } from '@nestjs/common';
import { OpenSearchServiceImpl } from './opensearch.service.impl';
import { OPENSEARCH } from '../opensearch.token';

export const providers: Provider[] = [
  {
    provide: OPENSEARCH,
    useClass: OpenSearchServiceImpl,
  },
];
