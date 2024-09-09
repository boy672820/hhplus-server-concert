import * as winston from 'winston';
import { LoggerModuleOptions } from './logger.interface';

const printFormats = [
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(
    ({
      level,
      message,
      label,
      timestamp,
      stack: _stack,
      meta: _meta,
      serviceName: _serviceName,
    }) => {
      const stack = _stack ? `\n${_stack}` : '';
      const meta = _meta ? `\nMeta: ${JSON.stringify(_meta, null, 2)}` : '';
      const serviceName = _serviceName ? ` [${_serviceName}]` : '';

      return `[${label}] - ${timestamp} ${level}${serviceName}: ${message}${stack}${meta}`;
    },
  ),
];

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

const defaultTransports = [
  new winston.transports.File({
    level: 'info',
    filename: 'logs/combined.log',
    format: jsonFormat,
  }),
  new winston.transports.File({
    level: 'error',
    filename: 'logs/error.log',
    format: jsonFormat,
  }),
];

export const createLogger = (options: LoggerModuleOptions) => {
  const transports = options.transports || defaultTransports;
  const logger = winston.createLogger({ transports });

  if (options?.environment !== 'production') {
    logger.add(
      new winston.transports.Console({
        level: 'debug',
        format: winston.format.combine(
          winston.format.label({ label: options.appName || 'MyApp' }),
          ...printFormats,
        ),
      }),
    );
  }

  return logger;
};
