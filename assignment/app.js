module.exports = function(app) {
    var models = require('./model/models.js')();

    var pageService = require('./services/page.service.server.js')(app, models);
    var userService = require('./services/user.service.server.js')(app, models);
    var websiteService = require('./services/website.service.server.js')(app, models);
    var widgetService = require('./services/widget.service.server.js')(app, models);
}
