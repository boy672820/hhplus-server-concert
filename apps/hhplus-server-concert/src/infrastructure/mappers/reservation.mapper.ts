import { ReservationEntity } from '@libs/database/entities';
import { SeatEntity } from '@libs/database/entities';
import { Injectable } from '@nestjs/common';
import { Reservation } from '../../domain/models';
import { ReservationFactory } from '../../domain/factories/reservation.factory';

@Injectable()
export class ReservationMapper {
  constructor(private readonly reservationFactory: ReservationFactory) {}

  toModel = (entity: ReservationEntity): Reservation =>
    this.reservationFactory.reconstitute({
      id: entity.id,
      userId: entity.userId,
      eventId: entity.eventId,
      eventTitle: entity.detail.eventTitle,
      eventAddress: entity.detail.eventAddress,
      eventStartDate: entity.detail.eventStartDate,
      eventEndDate: entity.detail.eventEndDate,
      seatId: entity.seat.id,
      seatNumber: entity.seatNumber,
      price: entity.price,
      status: entity.status,
      reservationDetailId: entity.detail.id,
      scheduleStartDate: entity.scheduleStartDate,
      scheduleEndDate: entity.scheduleEndDate,
      expiresDate: entity.expiresDate,
      createdDate: entity.createdDate,
    });

  static toEntity = (model: Reservation): ReservationEntity => {
    const entity = new ReservationEntity();
    entity.id = model.id;
    entity.userId = model.userId;
    entity.eventId = model.eventId;
    entity.seat = {
      id: model.seatId,
    } as SeatEntity;
    entity.seatNumber = model.seatNumber;
    entity.price = model.price;
    entity.detail = {
      id: model.reservationDetailId,
      eventTitle: model.eventTitle,
      eventAddress: model.eventAddress,
      eventStartDate: model.eventStartDate,
      eventEndDate: model.eventEndDate,
    };
    entity.status = model.status;
    entity.scheduleStartDate = model.scheduleStartDate;
    entity.scheduleEndDate = model.scheduleEndDate;
    entity.expiresDate = model.expiresDate;
    entity.createdDate = model.createdDate;
    return entity;
  };
}
