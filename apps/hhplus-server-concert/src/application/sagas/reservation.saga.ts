import { Injectable } from '@nestjs/common';
import { ofType, Saga } from '@nestjs/cqrs';
import { mergeMap, map, Observable } from 'rxjs';
import {
  ReservationCancelledEvent,
  ReservationReservedSeatEvent,
} from '../../domain/events';
import {
  CancelReservationCommand,
  ReserveSeatCommand,
  PublishOutboxCommand,
} from '../commands';

@Injectable()
export class ReservationSagas {
  @Saga()
  reservedSeat = (events$: Observable<any>): Observable<any> =>
    events$.pipe(
      ofType(ReservationReservedSeatEvent),
      map((event) => [
        new ReserveSeatCommand(event.seatId, event.reservationId),
        new PublishOutboxCommand(),
      ]),
      mergeMap((commands) => commands),
    );

  @Saga()
  cancelledReservation = (events$: Observable<any>): Observable<any> =>
    events$.pipe(
      ofType(ReservationCancelledEvent),
      map((event) => new CancelReservationCommand(event.reservationId)),
    );
}
