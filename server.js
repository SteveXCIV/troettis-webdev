var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var uuid = require('node-uuid');
// Attach a global ID generating function to app
app.getNextId = function() {
    return uuid.v4();
}

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

require('./test/app.js')(app);
require('./assignment/app.js')(app);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port, ipaddress);
