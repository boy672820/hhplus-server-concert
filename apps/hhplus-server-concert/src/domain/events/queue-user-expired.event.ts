export class QueueUserExpiredEvent {
  constructor(public readonly userId: string) {}
}
