import {consoleTransport, logger} from 'react-native-logs';

function Logger(type: 'info' | 'debug' | 'error' | 'warn', message: any) {
  const configDefault = {
    levels: {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    },
    severity: 'debug',
    transport: consoleTransport,
    transportOptions: {
      colors: {
        info: 'blueBright',
        warn: 'yellowBright',
        error: 'redBright',
      },
    },
    async: true,
    dateFormat: 'time',
    printLevel: true,
    printDate: true,
    enabled: true,
  };
  const log = logger.createLogger(configDefault);
  switch (type) {
    case 'info':
      return log.info(message);
    case 'debug':
      return log.debug(message);
    case 'error':
      return log.error(message);
    case 'warn':
      return log.warn(message);
    default:
      break;
  }
}
export default Logger;
