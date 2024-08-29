export interface LoggerService {
  error(
    message: string,
    service?: string,
    errorOrMeta?: Error | Record<string, any>,
  ): void;
  warn(message: string, service?: string, meta?: Record<string, any>): void;
  http(message: string, service?: string, meta?: Record<string, any>): void;
  info(message: string, service?: string, meta?: Record<string, any>): void;
  debug(message: string, service?: string): void;
}
