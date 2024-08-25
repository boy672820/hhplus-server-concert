import http from 'k6/http';
import { sleep, check } from 'k6';
import { Trend, Counter } from 'k6/metrics';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
import {
  config,
  getEncodedDates,
  getRandom,
  getQueueToken,
  retryReservation,
  getUserId,
  getEvents,
  getSchedules,
  getSeats,
} from './helpers/index.js';

const createAverageLoadStages = (target) => [
  { duration: '5s', target },
  { duration: '25s', target },
  { duration: '5s', target: 0 },
];

const scenarioKeys = {
  [0]: 'scenario_1_find_events',
  [1]: 'scenario_2_find_schedules_by_event',
  [2]: 'scenario_3_find_seats_by_schedule',
  [3]: 'scenario_4_reserve_seat',
  [4]: 'scenario_5_pay_reservation',
  [5]: 'scenario_6_recharge_point',
};

export const options = {
  scenarios: {
    [scenarioKeys[0]]: {
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 150,
      maxVUs: 200,
      stages: createAverageLoadStages(150),
      exec: 'findEvents',
    },
    [scenarioKeys[1]]: {
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 100,
      maxVUs: 150,
      stages: createAverageLoadStages(100),
      exec: 'findSchedulesByEvent',
    },
    [scenarioKeys[2]]: {
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 100,
      maxVUs: 150,
      stages: createAverageLoadStages(100),
      exec: 'findSeatsBySchedule',
    },
    [scenarioKeys[3]]: {
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 60,
      maxVUs: 100,
      stages: createAverageLoadStages(60),
      exec: 'reserveSeat',
    },
    [scenarioKeys[4]]: {
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 20,
      maxVUs: 60,
      stages: createAverageLoadStages(20),
      exec: 'payReservation',
    },
    [scenarioKeys[5]]: {
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 20,
      maxVUs: 60,
      stages: createAverageLoadStages(20),
      exec: 'rechargePoint',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(100)<1000'],
  },
};

const eventDurationTrend = new Trend('trend_event_duration');
const eventReqCounter = new Counter('counter_event_req');

const scheduleDurationTrend = new Trend('trend_schedule_duration');
const scheduleReqCounter = new Counter('counter_schedule_req');

const seatDurationTrend = new Trend('trend_seat_duration');
const seatReqCounter = new Counter('counter_seat_req');

const reserveSeatDurationTrend = new Trend('trend_reserve_seat_duration');
const reserveSeatReqCounter = new Counter('counter_reserve_seat_req');

const payReservationDurationTrend = new Trend('trend_pay_reservation_duration');
const payReservationReqCounter = new Counter('counter_pay_reservation_req');

const rechargePointDurationTrend = new Trend('trend_recharge_point_duration');
const rechargePointReqCounter = new Counter('counter_recharge_point_req');

export function handleSummary(data) {
  const {
    trend_event_duration: eventDuration,
    trend_schedule_duration: scheduleDuration,
    trend_seat_duration: seatDuration,
    trend_reserve_seat_duration: reserveSeatDuration,
    trend_pay_reservation_duration: payReservationDuration,
    trend_recharge_point_duration: rechargePointDuration,
    counter_event_req: eventCount,
    counter_schedule_req: scheduleCount,
    counter_seat_req: seatCount,
    counter_reserve_seat_req: reserveSeatCount,
    counter_pay_reservation_req: payReservationCount,
    counter_recharge_point_req: rechargePointCount,
  } = data.metrics;
  const counts = [
    eventCount,
    scheduleCount,
    seatCount,
    reserveSeatCount,
    payReservationCount,
    rechargePointCount,
  ];
  const durations = [
    eventDuration,
    scheduleDuration,
    seatDuration,
    reserveSeatDuration,
    payReservationDuration,
    rechargePointDuration,
  ];
  const tps = durations.reduce(
    (acc, { values }, i) => {
      const target = acc[scenarioKeys[i]];
      const count = counts[i].values.count;
      target.values.avg = count / (values.avg / 1000);
      target.values.min = count / (values.min / 1000);
      target.values.med = count / (values.med / 1000);
      target.values.max = count / (values.max / 1000);
      target.values['p(95)'] = count / (values['p(95)'] / 1000);
      target.values['p(90)'] = count / (values['p(90)'] / 1000);
      return acc;
    },
    {
      [scenarioKeys[0]]: {
        type: 'trend',
        values: {
          avg: 0,
          min: 0,
          med: 0,
          max: 0,
          ['p(95']: 0,
          ['p(90)']: 0,
        },
      },
      [scenarioKeys[1]]: {
        type: 'trend',
        values: {
          avg: 0,
          min: 0,
          med: 0,
          max: 0,
          ['p(95']: 0,
          ['p(90)']: 0,
        },
      },
      [scenarioKeys[2]]: {
        type: 'trend',
        values: {
          avg: 0,
          min: 0,
          med: 0,
          max: 0,
          ['p(95']: 0,
          ['p(90)']: 0,
        },
      },
      [scenarioKeys[3]]: {
        type: 'trend',
        values: {
          avg: 0,
          min: 0,
          med: 0,
          max: 0,
          ['p(95)']: 0,
          ['p(90)']: 0,
        },
      },
      [scenarioKeys[4]]: {
        type: 'trend',
        values: {
          avg: 0,
          min: 0,
          med: 0,
          max: 0,
          ['p(95)']: 0,
          ['p(90)']: 0,
        },
      },
      [scenarioKeys[5]]: {
        type: 'trend',
        values: {
          avg: 0,
          min: 0,
          med: 0,
          max: 0,
          ['p(95)']: 0,
          ['p(90)']: 0,
        },
      },
    },
  );

  data.metrics[scenarioKeys[0]] = tps[scenarioKeys[0]];
  data.metrics[scenarioKeys[1]] = tps[scenarioKeys[1]];
  data.metrics[scenarioKeys[2]] = tps[scenarioKeys[2]];
  data.metrics[scenarioKeys[3]] = tps[scenarioKeys[3]];
  data.metrics[scenarioKeys[4]] = tps[scenarioKeys[4]];
  data.metrics[scenarioKeys[5]] = tps[scenarioKeys[5]];

  return {
    'k6/summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: '→', enableColors: true }),
  };
}

export function findEvents() {
  const { res } = getEvents();

  sleep(4);

  eventDurationTrend.add(res.timings.duration + 4000);
  eventReqCounter.add(1);
}

export function findSchedulesByEvent() {
  const { data: events } = getEvents();
  const event = getRandom(events);
  const { startDate, endDate } = getEncodedDates();
  const { res } = getSchedules(event.id, startDate, endDate);

  sleep(4);

  scheduleDurationTrend.add(res.timings.duration + 4000);
  scheduleReqCounter.add(1);
}

export function findSeatsBySchedule() {
  const { data: events } = getEvents();
  const event = getRandom(events);
  const { startDate, endDate } = getEncodedDates();
  const { data: schedules } = getSchedules(event.id, startDate, endDate);

  if (schedules.length === 0) {
    return;
  }

  const schedule = getRandom(schedules);
  const { res } = getSeats(schedule.id);

  sleep(4);

  seatDurationTrend.add(res.timings.duration + 4000);
  seatReqCounter.add(1);
}

export function reserveSeat() {
  const { data: events } = getEvents();
  const event = getRandom(events);
  const { startDate, endDate } = getEncodedDates();
  const { data: schedules } = getSchedules(event.id, startDate, endDate);

  if (schedules.length === 0) {
    return;
  }

  const schedule = getRandom(schedules);
  const { data: seats } = getSeats(schedule.id);
  const userId = getUserId();
  const queueToken = getQueueToken(userId);
  const seat = getRandom(seats);

  const res = retryReservation(10, seat.id, queueToken);

  sleep(5);

  reserveSeatDurationTrend.add(res.timings.duration + 5000);
  reserveSeatReqCounter.add(1);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'status is 409': (r) => r.status === 409,
    'status is 500': (r) => r.status === 500,
  });
}

export function payReservation() {
  const { data: events } = getEvents();
  const event = getRandom(events);
  const { startDate, endDate } = getEncodedDates();
  const { data: schedules } = getSchedules(event.id, startDate, endDate);

  if (schedules.length === 0) {
    return;
  }

  const schedule = getRandom(schedules);
  const { data: seats } = getSeats(schedule.id);
  const userId = getUserId();
  const queueToken = getQueueToken(userId);
  const seat = getRandom(seats);

  const reservationResponse = retryReservation(10, seat.id, queueToken);

  if (reservationResponse.body == null || reservationResponse.status !== 201) {
    return;
  }

  const { data } = JSON.parse(reservationResponse.body);

  const reservationId = data.id;
  const body = { reservationId };
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userId}`,
  };

  const res = http.post(`${config.BASE_URL}/payments`, JSON.stringify(body), {
    headers,
  });

  sleep(1);

  payReservationDurationTrend.add(res.timings.duration + 1000);
  payReservationReqCounter.add(1);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'status is 409': (r) => r.status === 409,
    'status is 500': (r) => r.status === 500,
  });
}

export function rechargePoint() {
  const userId = getUserId();
  const headers = { Authorization: `Bearer ${userId}` };
  const body = { amount: 1000 };
  const res = http.patch(
    `${config.BASE_URL}/point/charge`,
    JSON.stringify(body),
    { headers },
  );

  sleep(1);

  rechargePointDurationTrend.add(res.timings.duration + 1000);
  rechargePointReqCounter.add(1);
}
