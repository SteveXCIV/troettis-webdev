module.exports = function () {
    var mongoose = require('mongoose');
    var SubscriptionSchema = require('./subscription.schema.server.js')();
    var Subscription = mongoose.model('Subscription', SubscriptionSchema);

    var api = {
        'createSubscription': createSubscription,
        'findSubscriptionsByUser': findSubscriptionsByUser,
        'findSubscription': findSubscription,
        'deleteSubscription': deleteSubscription,
    };
    return api;

    function createSubscription(userId, communityId) {
        return Subscription.create({ user: userId, community: communityId });
    }

    function findSubscriptionsByUser(userId) {
        return Subscription
            .find({ user: userId })
            .populate('community');
    }

    function findSubscription(userId, communityId) {
        return Subscription.findOne({ user: userId, community: communityId });
    }

    function deleteSubscription(userId, communityId) {
        return Subscription.delete({ user: userId, community: communityId });
    }
};
