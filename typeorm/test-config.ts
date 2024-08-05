import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

interface Config {
  database: {
    type: 'mysql';
    name: string;
    username: string;
    password: string;
    host: string;
    port: number;
  };
}

export const config: Config = {
  database: {
    type: 'mysql',
    name: 'concert',
    username: 'concert',
    password: '123',
    host: 'localhost',
    port: 3302,
  },
};
