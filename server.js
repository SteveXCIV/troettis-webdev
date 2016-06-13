var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var connectionString = 'mongodb://127.0.0.1:27017/cs4550summer1';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        'cs4550summer1';
}

var mongoose = require("mongoose");
mongoose.connect(connectionString);

var shortid = require('shortid');
// Attach a global ID generating function to app
app.getNextId = function() {
    return shortid.generate();
}

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

require('./test/app.js')(app);
require('./assignment/app.js')(app);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ipaddress);
