module.exports = function(app) {
    var models = require('./model/models.js')();

    var communityService = require('./services/community.service.server.js')(app, models);
    var threadService = require('./services/thread.service.server.js')(app, models);
    var userService = require('./services/user.service.server.js')(app, models);
}
