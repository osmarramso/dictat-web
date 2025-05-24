let express = require('express'),
  //  mongoose = require('mongoose'),
   dbConfig = require('./database/db'),
   bodyParser = require('body-parser');

const winston = require('winston');
const routes = express.Router();

const cors = require('cors');

   
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [ 
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
   
// Connecting with mongo db
// mongoose.Promise = global.Promise;
// mongoose.connect(dbConfig.db, {
//    useNewUrlParser: true
// }).then(() => {
//       console.log('Database sucessfully connected');
//       logger.info('Database sucessfully connected');
//    },
//    error => {
//       console.log('Database could not connected: ' + error);
//       logger.error('Database could not connected: ' + error)
//    }
// )

const contactRoute = require('./routes/contact.routes')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(cors({
  origin: 'https://dictat.io'
}));

app.use('/api/contact', contactRoute)

app.route('/').get((req, res) => {
  res.send("Recognized endpoints on this server include none.")
})

console.log("Routes set");

// Create port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})


// error handler  
app.use(function (err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  logger.error(err.message);
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

// Catch unauthorised errors
app.use(function (err, req, res, next) {
   if (err.name === 'UnauthorizedError') {
     logger.error(err.name);
     res.status(401);
     res.json({"message" : err.name + ": " + err.message});
   }
 });

