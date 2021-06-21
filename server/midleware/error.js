const winston = require('winston');
module.exports = (err, req, res, next) => {
  console.log('err from winston Error File');
  console.log(err);
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: err },
    transports: [new winston.transports.File({ filename: 'combined.log' })]
  });
  logger.log('error', err, err);
  //   winston.info(err.message, err);
  res.sendStatus(403);
};
