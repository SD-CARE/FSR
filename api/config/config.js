const fs = require("fs");
require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      client: "pg",
      bigNumberStrings: true,
      socketPath: process.env.INSTANCE_UNIX_SOCKET,
      ssl: {
        require: true,
        sslmode: "verify-ca",
        rejectUnauthorized: false,
        ca: fs.readFileSync(__dirname + "/server-ca.pem"),
        key: fs.readFileSync(__dirname + "/client-key.pem"),
        cert: fs.readFileSync(__dirname + "/client-cert.pem"),
      },
    },
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: "127.0.0.1",
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      bigNumberStrings: true,
      socketPath: process.env.INSTANCE_UNIX_SOCKET,
    },
  },
};
