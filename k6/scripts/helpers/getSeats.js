import http from 'k6/http';
import { config } from './config.js';

export const getSeats = (scheduleId) => {
  const res = http.get(`${config.BASE_URL}/schedules/${scheduleId}/seats`);
  const { data } = JSON.parse(res.body);
  return { data, res };
};
