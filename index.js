require('dotenv').config();
require("dotenv-safe").config({allowEmptyValues: true});

const cfg = require('config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const  passport = require("passport");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const app = express();
const useragent = require('express-useragent');
const cookieParser = require('cookie-parser');

const dbPath = process.env.MONGODB_URI;
const db = mongoose.connection;

mongoose.connect(dbPath, { useNewUrlParser: true } );

db.on('error', console.error);
db.once('connected', function() { console.log(`${dbPath}`);});

db.once('open', function() {
	fs.readdirSync('./controllers').forEach(function(file) {
        if (file.substr(-3) === '.js' && file.substr(-7) !== 'spec.js') {
          require('./controllers/' + file).controller(app);
        }
    });
});

var xPolicy			    = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Credentials" ,"true");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token, X-CSRF-TOKEN, api-key, authorization, content-type");
  	next();
};
app.use(xPolicy);

app.use(useragent.express());

app.set('port', process.env.PORT || aport);

app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.text({ type: 'text/html' }))

app.enable('trust proxy');
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])

app.use(cookieParser());

app.all('*', function(req, res, next){ req.syspath = __dirname; next();});
app.all('*', function(req, res, next){ req.db	= db; next();});
//app.all('*', function(req, res, next){ req.email 	= mail;	next();});

app.use((req, res, next) => {
    if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
        return res.sendStatus(204);
    }; 
    return next();
});

initPassport = () => {

  app.use(passport.initialize());
  app.use(passport.session());
  require("./passport/auth")(passport);

  app.use(function (req, res, next) {
    const token = req.headers["token"];

    if (token) {
      jwt.verify(token, 'FuCKM0nk3Y', function (err, decoded) {
        if (err) {
          jwt.verify(token, 'FuCKM0nk3Y', function (err, decoded) {
            if (err) {
              res.status(401);
              return res.send(err);
            }
            req.decoded = decoded;
          });
        } else {
          req.decoded = decoded;
        }
      });
    }
    return next();
  });
}


const PORT = process.env.PORT || aport;
let server;
startServer = () => {
  server = app.listen(PORT, '0.0.0.0');
  server.on('listening', () => {
    console.log('Server running on port:', PORT);
    initPassport();
  });
}
if (process.env.MONGODB_URI) {
  const dbOptions = { keepAlive: 300000, connectTimeoutMS: 30000, useNewUrlParser: true };
    mongoose.set('useCreateIndex', true)
  mongoose.connect(process.env.MONGODB_URI, dbOptions);
  mongoose.Promise = global.Promise;
  let db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('db connected');
    startServer();
  });
} else {
  console.log('No DB connection configured');
  startServer();
}