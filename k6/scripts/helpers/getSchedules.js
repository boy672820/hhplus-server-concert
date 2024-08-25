import http from 'k6/http';
import { config } from './config.js';

export const getSchedules = (eventId, startDate, endDate) => {
  const res = http.get(
    `${config.BASE_URL}/events/${eventId}/schedules?startDate=${startDate}&endDate=${endDate}`,
  );
  const { data } = JSON.parse(res.body);
  return { data, res };
};
