module.exports = function() {
    var pageModel = require('./page/page.model.server.js')();
    var userModel = require('./user/user.model.server.js')();
    var websiteModel = require('./website/website.model.server.js')();
    var widgetModel = require('./widget/widget.model.server.js')(pageModel);

    var models = {
        pageModel: pageModel,
        userModel: userModel,
        websiteModel: websiteModel,
        widgetModel: widgetModel,
    };
    return models;
};
