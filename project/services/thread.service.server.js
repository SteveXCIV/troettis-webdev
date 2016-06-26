module.exports = function(app, models) {
    var err = require('./errorHandler')();
    var log = require('../../lib/logger')();
    var validate = require('express-validation');
    var validators = require('../validators/validators')();
    var threadModel = models.threadModel;

    app.post('/api/community/:communityId/thread', createThread);
    app.get('/api/thread/recent', findMostRecentThreads);
    app.get('/api/community/:communityId/thread', findThreadByCommunity);
    app.get('/api/thread/:threadId', findThreadById);
    app.put('/api/thread/:threadId', updateThread);
    app.delete('/api/thread/:threadId', deleteThread);

    function createThread(req, res) {
        var thread = req.body;
        var communityId = req.params.communityId;

        // TODO: Make it so only a logged in user may post a thread

        thread.community = communityId;

        threadModel
            .createThread(thread)
            .then(
                function (thread) {
                    res.json(thread);
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }

    function findMostRecentThreads(req, res) {
        threadModel
            .findMostRecentThreads()
            .then(
                function (threads) {
                    res.json(threads);
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }

    function findThreadByCommunity(req, res) {
        var communityId = req.params.communityId;
        threadModel
            .findThreadByCommunity(communityId)
            .then(
                function (threads) {
                    res.json(threads);
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }

    function findThreadById(req, res) {
        var threadId = req.params.threadId;
        threadModel
            .findThreadById(threadId)
            .then(
                function (thread) {
                    if (thread) {
                        res.json(thread);
                    } else {
                        res
                            .status(404)
                            .json(['Thread not found.']);
                    }
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }

    function updateThread(req, res) {
        var threadId = req.params.threadId;
        var changes = req.body;

        // TODO: Protection so only a user may change their thread

        threadModel
            .updateThread(threadId, changes)
            .then(
                function (thread) {
                    if (thread) {
                        res.json(thread);
                    } else {
                        res
                            .status(404)
                            .json(['Thread not found.']);
                    }
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }

    function deleteThread(req, res) {
        var threadId = req.params.threadId;

        // TODO: Protection so only moderators may remove threads

        threadModel
            .deleteThread(threadId)
            .then(
                function (response) {
                    res.status(200).end();
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }
}
