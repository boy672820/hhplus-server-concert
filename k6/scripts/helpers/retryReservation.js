import http from 'k6/http';
import { sleep } from 'k6';
import { config } from './config.js';

export const retryReservation = (retry = 10, seatId, queueToken) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${queueToken}`,
  };
  const body = { seatId };
  const res = http.post(
    `${config.BASE_URL}/reservations`,
    JSON.stringify(body),
    { headers },
  );

  if (res.status === 400) {
    console.log('Response:', res);
  }

  if (res.status === 403 && retry > 0) {
    sleep(1);
    return retryReservation(retry - 1, seatId, queueToken);
  }

  return res;
};
