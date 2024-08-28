import { Client } from '@opensearch-project/opensearch';

interface ProviderOptions {
  url: string;
}

export const createOpensearchClient = ({ url }: ProviderOptions): Client =>
  new Client({ node: url });
