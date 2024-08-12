import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import {
  Reservation,
  ReservationProps,
  ReservationCreateProps,
} from '../models';

@Injectable()
export class ReservationFactory {
  constructor(private readonly eventPublisher: EventPublisher) {}

  create = (props: ReservationCreateProps): Reservation =>
    this.eventPublisher.mergeObjectContext(Reservation.create(props));

  reconstitute = (props: ReservationProps): Reservation =>
    this.eventPublisher.mergeObjectContext(Reservation.from(props));
}
