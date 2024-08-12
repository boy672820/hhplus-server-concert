import http from 'k6/http';
import { sleep, check } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

const BASE_URL = 'http://localhost:3001';

export const options = {
  scenarios: {
    events_schedules_seats: {
      executor: 'ramping-arrival-rate',
      exec: 'events_schedules_seats',
      preAllocatedVUs: 1000,
      startTime: '0s',
      startRate: 0,
      stages: [
        { duration: '9s', target: 1000 },
        { duration: '45s', target: 1000 },
        { duration: '6s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(99)<500'],
  },
};

export function handleSummary(data) {
  const tps = (
    data.metrics.http_reqs.values.count /
    data.metrics.http_req_duration.values.avg
  ).toFixed(2);
  const response_time = data.metrics.http_req_duration.values.avg;
  const http_reqs = data.metrics.http_reqs.values.count;
  const http_reqs_failed = data.metrics.http_req_failed.values.rate;

  console.log(
    `Transactions per second (TPS): ${tps}
    Response Time (avg): ${response_time} ms
    Total Requests: ${http_reqs}
    Failed Requests: ${http_reqs_failed * 100}%`,
  );

  return {
    'k6/summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: '→', enableColors: true }),
  };
}

export function events_schedules_seats() {
  const eventsResponse = http.get(`${BASE_URL}/events`);

  sleep(2);

  const before = new Date();
  before.setDate(1);
  const after = new Date();
  after.setMonth(after.getMonth() + 1);
  const startDate = before.toISOString().split('T')[0] + 'T00:00:00';
  const endDate = after.toISOString().split('T')[0] + 'T23:59:59';

  const schedulesResponse = http.get(
    `${BASE_URL}/schedules?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
  );
  const { data: schedules } = JSON.parse(schedulesResponse.body);
  const randomIndex = Math.floor(Math.random() * schedules.length);
  const randomSchedule = schedules[randomIndex];

  sleep(1);

  const seatsResponse = http.get(
    `${BASE_URL}/schedules/${randomSchedule.id}/seats`,
  );

  console.log(eventsResponse);

  check(
    [eventsResponse, schedulesResponse, seatsResponse],
    {
      'Events status is 200': (r) => r[0].status === 200,
      'Events status is 4xx': (r) => r[0].status >= 400,
      'Events status is 500': (r) => r[0].status === 500,
      'Schedules status is 200': (r) => r[1].status === 200,
      'Schedules status is 4xx': (r) => r[1].status >= 400,
      'Schedules status is 500': (r) => r[1].status === 500,
      'Seats status is 200': (r) => r[2].status === 200,
      'Seats status is 4xx': (r) => r[2].status >= 400,
      'Seats status is 500': (r) => r[2].status === 500,
    },
    { tag: 'events_schedules_seats' },
  );

  sleep(1);
}
