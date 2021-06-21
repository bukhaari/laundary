const helmet = require("helmet");
const compression = require("compression");
const sslRedirect = require("heroku-ssl-redirect");

module.exports = function (app) {
  app.use(helmet());
  app.use(compression());
  app.use(sslRedirect());
};
