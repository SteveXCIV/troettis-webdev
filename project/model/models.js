module.exports = function() {
    var communityModel = require('./community/community.model.server.js')();
    var commentModel = require('./comment/comment.model.server.js')();
    var subscriptionModel = require('./subscription/subscription.model.server.js')();
    var threadModel = require('./thread/thread.model.server.js')();
    var userModel = require('./user/user.model.server.js')();

    var models = {
        communityModel: communityModel,
        commentModel: commentModel,
        subscriptionModel: subscriptionModel,
        threadModel: threadModel,
        userModel: userModel,
    };
    return models;
};
