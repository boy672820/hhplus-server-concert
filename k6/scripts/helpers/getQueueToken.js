import http from 'k6/http';
import { config } from './config.js';

export const getQueueToken = (userId) => {
  const tokenResponse = http.post(
    `${config.BASE_URL}/queue/token`,
    {},
    { headers: { Authorization: `Bearer ${userId}` } },
  );
  const { data } = JSON.parse(tokenResponse.body);
  return data.token;
};
