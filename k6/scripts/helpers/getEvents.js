import http from 'k6/http';
import { config } from './config.js';

export const getEvents = () => {
  const res = http.get(`${config.BASE_URL}/events`);
  const { data } = JSON.parse(res.body);
  return { data, res };
};
