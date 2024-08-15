import { Injectable } from '@nestjs/common';
import { ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import {
  ReservationCancelledEvent,
  ReservationReservedSeatEvent,
} from '../../domain/events';
import { CancelReservationCommand, ReserveSeatCommand } from '../commands';

@Injectable()
export class ReservationSagas {
  @Saga()
  reservedSeat = (events$: Observable<any>): Observable<any> =>
    events$.pipe(
      ofType(ReservationReservedSeatEvent),
      map((event) => new ReserveSeatCommand(event.seatId, event.reservationId)),
    );

  @Saga()
  cancelledReservation = (events$: Observable<any>): Observable<any> =>
    events$.pipe(
      ofType(ReservationCancelledEvent),
      map((event) => new CancelReservationCommand(event.reservationId)),
    );
}
