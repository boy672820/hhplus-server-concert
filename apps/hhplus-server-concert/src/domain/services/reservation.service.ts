import { EventType } from '@libs/domain/types';
import { DomainError } from '@libs/common/errors';
import { LoggerService } from '@libs/logger';
import { InjectLogger } from '@libs/logger/decorators';
import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { Reservation } from '../models';
import { ReservationFactory } from '../factories/reservation.factory';
import {
  EventRepository,
  ReservationRepository,
  ScheduleRepository,
  SeatRepository,
} from '../repositories';
import { ReservationProducer } from '../producers';
import { OutboxAdapter } from '../adapters';
import { ReservationCreatedEvent } from '../events';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationFactory: ReservationFactory,
    private readonly reservationRepository: ReservationRepository,
    private readonly eventRepository: EventRepository,
    private readonly scheduleRepository: ScheduleRepository,
    private readonly seatRepository: SeatRepository,
    private readonly reservationProducer: ReservationProducer,
    private readonly outboxAdapter: OutboxAdapter,
    @InjectLogger() private readonly logger: LoggerService,
  ) {}

  @Transactional()
  async create({
    userId,
    seatId,
  }: {
    userId: string;
    seatId: string;
  }): Promise<Reservation> {
    const seat = await this.seatRepository.findById(seatId);

    if (!seat) {
      throw DomainError.notFound('좌석을 찾을 수 없습니다.');
    }

    if (seat.isNotAvailable()) {
      throw DomainError.conflict('이미 예약된 좌석입니다.');
    }

    const event = await this.eventRepository.findById(seat.eventId);

    if (!event) {
      throw DomainError.notFound('이벤트를 찾을 수 없습니다.');
    }

    const schedule = await this.scheduleRepository.findById(seat.scheduleId);

    if (!schedule) {
      throw DomainError.notFound('스케줄을 찾을 수 없습니다.');
    }

    const reservation = this.reservationFactory.create({
      userId,
      seatId,
      seatNumber: seat.number,
      price: seat.price,
      eventId: seat.eventId,
      eventTitle: event.title,
      eventAddress: event.address,
      eventStartDate: event.startDate,
      eventEndDate: event.endDate,
      scheduleStartDate: schedule.startDate,
      scheduleEndDate: schedule.endDate,
    });

    await this.reservationRepository.save(reservation);

    const transaction = await this.outboxAdapter.publish(
      EventType.ReservationReservedSeat,
      ReservationCreatedEvent.toPayload({
        reservationId: reservation.id,
        seatId: seat.id,
      }),
    );

    reservation.create({ seatId, transactionId: transaction.id });
    reservation.commit();

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

    reservation.commit();

    return reservation;
  }

  async cancel(reservationId: string): Promise<void> {
    const reservation =
      await this.reservationRepository.findById(reservationId);

    if (!reservation) {
      throw DomainError.notFound('예약을 찾을 수 없습니다.');
    }

    await this.reservationRepository.remove(reservation);
  }

  emitReservedSeat(payload: {
    transactionId: string;
    seatId: string;
    reservationId: string;
  }): void {
    this.reservationProducer.emitReservedSeat(payload);
  }
}
