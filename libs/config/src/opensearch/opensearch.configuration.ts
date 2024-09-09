import { registerAs } from '@nestjs/config';

export default registerAs('opensearch', () => ({
  url: process.env.OPENSEARCH_URL,
}));
