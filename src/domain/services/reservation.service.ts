import { DomainError } from '@lib/errors';
import { Injectable } from '@nestjs/common';
import { Reservation } from '../models';
import {
  EventRepository,
  ReservationRepository,
  ScheduleRepository,
} from '../repositories';
import Decimal from 'decimal.js';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly scheduleRepository: ScheduleRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  async create({
    userId,
    seatId,
    seatNumber,
    price,
    eventId,
    scheduleId,
  }: {
    userId: string;
    seatId: string;
    seatNumber: number;
    price: Decimal;
    eventId: string;
    scheduleId: string;
  }): Promise<Reservation> {
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw DomainError.notFound('이벤트를 찾을 수 없습니다.');
    }

    const schedule = await this.scheduleRepository.findById(scheduleId);

    if (!schedule) {
      throw DomainError.notFound('스케줄을 찾을 수 없습니다.');
    }

    const reservation = Reservation.create({
      userId,
      seatId,
      seatNumber,
      price,
      eventId,
      eventTitle: event.title,
      eventAddress: event.address,
      eventStartDate: event.startDate,
      eventEndDate: event.endDate,
      scheduleStartDate: schedule.startDate,
      scheduleEndDate: schedule.endDate,
    });
    await this.reservationRepository.save(reservation);
    return reservation;
  }

  async pay({
    userId,
    reservationId,
  }: {
    userId: string;
    reservationId: string;
  }): Promise<Reservation> {
    const reservation =
      await this.reservationRepository.findById(reservationId);

    if (!reservation) {
      throw DomainError.notFound('예약을 찾을 수 없습니다.');
    }

    reservation.pay(userId);

    await this.reservationRepository.save(reservation);

    return reservation;
  }
}
