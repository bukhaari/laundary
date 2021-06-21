// require("module-alias/register");
require('express-async-errors');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const { connect } = require('./models/Connection');
const app = express();
const error = require('./midleware/error');
const winston = require('winston');
const { jsonSecret, conString, PORT } = require('./config/keys');

//midleware

app.use(bodyparser.json({ limit: '1MB' }));
// app.use((req, res, next) => {
//   console.log(req.path);
//   next();
// });

var whitelist = ['http://localhost:5000/'];
var corsOptions = {
  origin: function (origin, callback) {
    // console.log(origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // console.log(origin);
      // console.log("error");
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));

const api_v1_Controler = require('./route/api-v1/controler');
app.use('/api-v1', api_v1_Controler);

if (process.env.NODE_ENV == 'production') {
  require('./config/prod')(app);

  app.use(express.static(__dirname + '/public/'));

  app.get(/.*/, (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });
}

// Express error MidleWare
app.use(error);

process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection Error');
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: err },
    transports: [
      new winston.transports.File({ filename: 'PromiseRejects.log' })
    ]
  });
  logger.log('error', err);
  // throw "UnhandledPromice rejection aa dhacay";
  console.log('err.......', err);
});

if (!jsonSecret || !conString) {
  //   console.log(jsonSecret);
  console.log('Enviroment viriable is not set');
  process.exit(1);
}

// the server port
async function StartServe() {
  try {
    const connected = await connect();
    app.listen(PORT, () => {
      console.log(connected);
      console.log(`server started on Port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

StartServe();
