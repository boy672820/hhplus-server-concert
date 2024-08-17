export abstract class MockApiAdapter {
  abstract send(...args: any[]): Promise<void>;
}
