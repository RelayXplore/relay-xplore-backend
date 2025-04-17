import { createLogger, transports, format } from 'winston';
import dayjs from 'dayjs';

import { env } from '../constants/env';
import { omit } from 'lodash';

const transportsList: Array<any> = [new transports.Console()];

// safely handles circular references
const safeStringify = (obj, indent = 2) => {
  let cache = [];
  const retVal = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === 'object' && value !== null
        ? cache.includes(value)
          ? undefined // Duplicate reference found, discard key
          : cache.push(value) && value // Store value in our collection
        : value,
    indent,
  );
  cache = null;
  return retVal;
};

// Create a Winston logger that streams to Stackdriver Logging
// Logs will be written to: "projects/PROJECT_ID/logs/winston_log"
export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.printf(({ level, message, timestamp, ...resPayload }) => {
      try {
        const payload = {
          message,
          level,
          custom: {
            ...omit(resPayload, [Symbol.for('level')], [Symbol.for('splat')]),
          },
          timestamp: dayjs(timestamp as string).format(),
        };

        if (env.isDevelopment || env.isTestnet) {
          console.log(message, payload);
        }

        return safeStringify(payload);
      } catch (error) {
        logger.error(`LOGGER_ERROR: ${error.message}`, { error });
      }
    }),
  ),
  transports: transportsList,
});

export default logger;
