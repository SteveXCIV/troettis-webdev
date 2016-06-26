module.exports = function () {
    var mongoose = require('mongoose');

    var SubscriptionSchema = mongoose.Schema({
        user: { type: String, required: true, ref: 'User' },
        community: { type: String, required: true, ref: 'Community' },
    }, { collection: 'project.subscription' });

    return SubscriptionSchema;
};
