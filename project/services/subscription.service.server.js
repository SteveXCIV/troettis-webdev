module.exports = function(app, models) {
    var err = require('./errorHandler')();
    var log = require('../../lib/logger')();
    var subscriptionModel = models.subscriptionModel;

    app.post('/api/subscribe/:userId/:communityId', createSubscription);
    app.get('/api/subscription/get/:userId/:communityId', findSubscription);
    app.get('/api/subscription/user/:userId', findSubscriptionsForUser);
    app.delete('/api/unsubscribe/:userId/:communityId', deleteSubscription);

    function createSubscription(req, res) {
        var userId = req.params.userId;
        var communityId = req.params.communityId;

        subscriptionModel
            .createSubscription(userId, communityId)
            .then(
                function (response) {
                    res.json(response);
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }

    function findSubscription(req, res) {
        var userId = req.params.userId;
        var communityId = req.params.communityId;

        subscriptionModel
            .findSubscription(userId, communityId)
            .then(
                function (response) {
                    if (response) {
                        res.json(response);
                    } else {
                        res.json(0);
                    }
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }

    function findSubscriptionsForUser(req, res) {
        var userId = req.params.userId;

        subscriptionModel
            .findSubscriptionsByUser(userId)
            .then(
                function (response) {
                    res.json(response);
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }

    function deleteSubscription(req, res) {
        var userId = req.params.userId;
        var communityId = req.params.communityId;

        subscriptionModel
            .createSubscription(userId, communityId)
            .then(
                function (response) {
                    res.json(response);
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }
}
