import http from 'k6/http';
import { sleep, check } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

const BASE_URL = 'http://localhost:3001';

export const options = {
  scenarios: {
    reserve: {
      executor: 'ramping-arrival-rate',
      exec: 'reserve',
      preAllocatedVUs: 1000,
      startTime: '0s',
      startRate: 2,
      stages: [
        { duration: '5m', target: 1000 },
        { duration: '25m', target: 1000 },
        { duration: '5m', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(100)<1000'],
  },
};

export function handleSummary(data) {
  const tps = (
    data.metrics.http_reqs.values.count /
    data.metrics.http_req_duration.values.avg
  ).toFixed(2);
  const response_time = data.metrics.http_req_duration.values.avg;
  const http_reqs = data.metrics.http_reqs.values.count;
  const http_reqs_failed = data.metrics.http_req_failed.values.rate.toFixed(2);

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

export function reserve() {
  const eventsResponse = http.get(`${BASE_URL}/events`);
  const { data: events } = JSON.parse(eventsResponse.body);
  const randomEvent = events[Math.floor(Math.random() * events.length)];

  sleep(1);

  const before = new Date();
  before.setDate(1);
  const after = new Date();
  after.setMonth(after.getMonth() + 2);
  const startDate = before.toISOString().split('T')[0] + 'T00:00:00';
  const endDate = after.toISOString().split('T')[0] + 'T23:59:59';

  const schedulesResponse = http.get(
    `${BASE_URL}/events/${randomEvent.id}/schedules?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
  );
  const { data: schedules } = JSON.parse(schedulesResponse.body);
  const randomSchedule =
    schedules[Math.floor(Math.random() * schedules.length)];

  sleep(1);

  const seatsResponse = http.get(
    `${BASE_URL}/schedules/${randomSchedule.id}/seats`,
  );
  const { data: seats } = JSON.parse(seatsResponse.body);
  const randomSeat = seats[Math.floor(Math.random() * seats.length)];

  const userId = Math.floor(Math.random() * 1000);
  const queueResponse = http.post(
    `${BASE_URL}/queue/token`,
    {},
    { headers: { Authorization: `Bearer ${userId}` } },
  );
  const {
    data: { token: queueToken },
  } = JSON.parse(queueResponse.body);

  sleep(3);

  const response = (() => {
    const reserve = (retry = 5) => {
      const response = http.post(
        `${BASE_URL}/reservations`,
        JSON.stringify({
          seatId: randomSeat.id,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${queueToken}`,
          },
        },
      );

      if (response.status === 403 && retry > 0) {
        sleep(3);
        return reserve(retry - 1);
      }

      return response;
    };

    return reserve();
  })();

  check(response, {
    'status is 201': (r) => r.status === 201,
    'status is 400': (r) => r.status === 400,
    'status is 401': (r) => r.status === 401,
    'status is 403': (r) => r.status === 403,
    'status is 404': (r) => r.status === 404,
    'status is 409': (r) => r.status === 409,
    'status is 422': (r) => r.status === 422,
    'status is 500': (r) => r.status === 500,
  });
}
