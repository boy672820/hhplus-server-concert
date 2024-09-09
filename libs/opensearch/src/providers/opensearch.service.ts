export type Document = Record<string, any>;

export interface OpenSearchService {
  index<T extends Document = Document>(index: string, document: T): Promise<T>;
}
