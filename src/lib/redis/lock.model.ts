import { Lock as Redlock } from 'redlock';

export class Lock {
  private constructor(
    private readonly lock: Redlock,
    private readonly resources: string[],
  ) {}

  static create = (lock: Redlock, resources: string[]): Lock =>
    new Lock(lock, resources);

  static channel = (resources: string[]): string =>
    `lock:${resources.join(':')}`;

  async release(): Promise<void> {
    await this.lock.release();
  }

  getChannel = (): string => Lock.channel(this.resources);
}
