const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'apiserver-service' },
  transports: [
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'apiserver.log' }),
    new winston.transports.Console()
  ],
  format: winston.format.combine(
      winston.format.label({
          label: `APIServer`
      }),
      winston.format.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss'
    }),
      winston.format.printf(info => `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`),
  )
});

module.exports = logger;