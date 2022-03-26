const winston = require("winston");
require("winston-mongodb");

const options = {
  production: {
    level: "info",
    handleExceptions: true,
    json: true,
    format: winston.format.combine(
      winston.format.timestamp({
        format: "MMM-DD-YYYY HH:mm:ss",
      }),
      winston.format.json()
    ),
    db: process.env.MONGO_LOG_DB,
    options: {
      useUnifiedTopology: true,
    },
    collection: "logs",
  },
  develop: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD ZZ HH:mm:ss",
      }),
      winston.format.printf(
        (info) =>
          `[${info.level.toUpperCase()}]:  ${[info.timestamp]}: ${info.message}`
      ),
      winston.format.colorize({ all: true, level: false })
    ),
  },
  test: {
    level: "info",
    handleExceptions: true,
    json: false,
    colorize: false,
    format: winston.format.printf((info) => `${info.level}: ${info.message}`),
  },
};

let transport;
if (process.env.NODE_ENV === "develop")
  transport = new winston.transports.Console(options.develop);
else if (process.env.NODE_ENV === "production")
  transport = new winston.transports.MongoDB(options.production);
else transport = new winston.transports.Console(options.test);

const logger = winston.createLogger({
  transports: [transport],
  exitOnError: false,
});

module.exports = logger;
