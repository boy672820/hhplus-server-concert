import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Seat, SeatCreateProps, SeatProps } from '../models';

@Injectable()
export class SeatFactory {
  constructor(private readonly eventPublisher: EventPublisher) {}

  create = (props: SeatCreateProps): Seat =>
    this.eventPublisher.mergeObjectContext(Seat.create(props));

  reconstitute = (props: SeatProps): Seat =>
    this.eventPublisher.mergeObjectContext(Seat.from(props));
}
