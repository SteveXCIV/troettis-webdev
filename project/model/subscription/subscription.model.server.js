module.exports = function () {
    var mongoose = require('mongoose');
    var SubscriptionSchema = require('./community.schema.server.js')();
    var Subscription = mongoose.model('Subscription', SubscriptionSchema);

    var api = {
        'createSubscription': createSubscription,
        'findSubscriptionsByUser': findSubscriptionsByUser,
        'findSubscriptionsByCommunity': findSubscriptionsByCommunity,
        'deleteSubscription': deleteSubscription,
    };
    return api;

    function createSubscription(userId, communityId) {
        return Subscription.create({ user: userId, community: communityId });
    }

    function findSubscriptionsByUser(userId) {
        return Subscription.find({ user: userId });
    }

    function findSubscriptionsByCommunity(communityId) {
        return Subscription.find({ community: communityId });
    }

    function deleteSubscription(userId, communityId) {
        return Subscription.delete({ user: userId, community: communityId });
    }
};
