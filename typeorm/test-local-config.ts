import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test.local' });

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
    type: (process.env.DATABASE_TYPE as 'mysql') || 'mysql',
    name: process.env.DATABASE_NAME || 'concert',
    username: process.env.DATABASE_USERNAME || 'concert',
    password: process.env.DATABASE_PASSWORD || '123',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT)
      : 3306,
  },
};
