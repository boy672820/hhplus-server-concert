import { Test } from '@nestjs/testing';
import { EventModule } from '../../src/modules/event/event.module';
import { authRequest, initializeApp } from '../fixtures';

describe('EventController (e2e)', () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventModule],
    }).compile();

    await initializeApp(moduleRef);
  });

  describe('GET /events/:id/schedules/available', () => {
    it('이벤트의 일정을 조회합니다.', () =>
      authRequest({
        get: '/events/01J28C0YT12GF9GPEHE4MW17CZ/schedules/available',
        auth: false,
      }).expect(200));

    describe('일정 조회 실패', () => {
      it('이벤트가 존재하지 않는 경우', () =>
        authRequest({
          get: '/events/01J28C14Q2EW9VY99JPARQ2Z43/schedules/available',
          auth: false,
        }).expect(404));
    });
  });

  describe('GET /schedules/:id/seats', () => {
    it('일정의 좌석을 조회합니다.', () =>
      authRequest({
        get: '/schedules/01J28C4G10MWR5B01YCVR0E9FG/seats',
        auth: false,
      }).expect(200));

    describe('좌석 조회 실패', () => {
      it('일정이 존재하지 않는 경우', () =>
        authRequest({
          get: '/schedules/01J28C5E3MGZQRXA1C590JB1YT/seats',
          auth: false,
        }).expect(404));
    });
  });

  describe('POST /reservations', () => {
    it('좌석을 예약합니다.', () =>
      authRequest({ post: '/reservations' })
        .send({
          seatId: '01J28CD01ADAA6WTX2KHWSKK92',
        })
        .expect(201));

    describe('예약 실패', () => {
      it('좌석이 존재하지 않는 경우', () =>
        authRequest({ post: '/reservations' })
          .send({
            seatId: '01J28CEJAQ2VAMRHBZ7YB7P05H',
          })
          .expect(404));
      it('이미 예약된 좌석인 경우', () =>
        authRequest({ post: '/reservations' })
          .send({ seatId: '01J28CG4AJKPBKZ3RKFQGQJE05' })
          .expect(409));
    });

    describe('POST /payments', () => {
      it('결제를 진행합니다.', () =>
        authRequest({ post: '/payments' })
          .send({ reservationId: '01J28DJHTCS2QC0WMZMGW47V35' })
          .expect(201));

      describe('결제 실패', () => {
        it('예약이 존재하지 않는 경우', () =>
          authRequest({ post: '/payments' })
            .send({ reservationId: '01J28DMKCSC1MD7SQBVYB41370' })
            .expect(404));

        it('보유한 포인트가 부족한 경우', () =>
          authRequest({ post: '/payments' })
            .send({ reservationId: '01J28DPJAC25ATQSFJM9JA6YA2' })
            .expect(422));
      });
    });
  });
});
