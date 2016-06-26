module.exports = function() {
    var communityModel = require('./community/community.model.server.js')();
    var threadModel = require('./thread/thread.model.server.js')();
    var userModel = require('./user/user.model.server.js')();

    var models = {
        communityModel: communityModel,
        threadModel: threadModel,
        userModel: userModel,
    };
    return models;
};
