const { createLogger, format, transports } = require("winston");
const winston = require("winston/lib/winston/config");
require("winston-mongodb");
const logger = createLogger({
  format: format.combine(format.timestamp(), format.prettyPrint()),

  transports: [
    new transports.Console(),
    new transports.File({ filename: "combined.log" }),

    new transports.MongoDB({
      db: "mongodb://127.0.0.1:5000/vidly",
      collection: "logs",
      options: { poolSize: 2, useNewUrlParser: true, useUnifiedTopology: true },
    }),
  ],
  
});

// const {logger} = require('../index')

// console.log(logger);


exports.error = (error, _, res, next) => {
  logger.error(error.message, error);
  res.status(500).send({ error: error.message });
  next();
};

exports.logger = logger
