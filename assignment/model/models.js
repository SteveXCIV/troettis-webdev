module.exports = function(app) {
    var userModel = require('./user/user.model.server.js')(app);
    var websiteModel = require('./website/website.model.server.js')(app);
    var pageModel = require('./page/page.model.server.js')(app);
    var widgetModel = require('./widget/widget.model.server.js')(app);

    var models = {
        pageModel: pageModel,
        userModel: userModel,
        websiteModel: websiteModel,
        widgetModel: widgetModel,
    };
    return models;
};
