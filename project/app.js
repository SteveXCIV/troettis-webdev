module.exports = function(app) {
    var models = require('./model/models.js')();

    var userService = require('./services/user.service.server.js')(app, models);
}
