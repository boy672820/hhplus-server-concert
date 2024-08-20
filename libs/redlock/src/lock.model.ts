import * as Redlock from 'redlock';

export class Lock {
  private constructor(
    private readonly lock: Redlock,
    private readonly _resources: string[],
  ) {}

  get resources(): string[] {
    return this._resources;
  }

  static channel: string = 'lock';

  static create = (lock: Redlock, _resources: string[]): Lock =>
    new Lock(lock, _resources);

  async release(): Promise<void> {
    await this.lock.unlock();
  }

  static toReleased = (_resources: string[]): string =>
    `released:${_resources.join(',')}`;
}
