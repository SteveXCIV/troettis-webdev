var biome = require('./lib/biome.js')();
var log = require('./lib/logger')();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');

var SESSION_SECRET = biome.get('SESSION_SECRET');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({ secret: SESSION_SECRET }));

app.use(passport.initialize());
app.use(passport.session());

var connectionString = 'mongodb://127.0.0.1:27017/cs4550summer1';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

var mongoose = require("mongoose");
mongoose.connect(connectionString);

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

require('./db_test/app.js')(app);
// require('./assignment/app.js')(app);
require('./project/app.js')(app);

// catch-all error handler
app.use(function(err, req, res, next) {
    log.error(`Failed to handle request to endpoint = ${req.method} ${req.path} with payload:\n ${JSON.stringify(req.body)}\n\t`, err);
    log.error(err.toString());
    res
        .status(400)
        .json(err);
});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

log.debug(`Server start. IP: ${ipaddress || 'localhost'}, Port: ${port}`);
app.listen(port, ipaddress);
