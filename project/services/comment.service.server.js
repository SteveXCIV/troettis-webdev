module.exports = function(app, models) {
    var err = require('./errorHandler')();
    var log = require('../../lib/logger')();
    var validate = require('express-validation');
    var validators = require('../validators/validators')();
    var commentModel = models.commentModel;

    app.post('/api/thread/:threadId/comment', createComment);
    app.get('/api/thread/:threadId/comment', findCommentByThread);
    app.put('/api/comment/:commentId', updateComment);

    function createComment(req, res) {
        var comment = req.body;
        var threadId = req.params.threadId;

        if (req.user) {
            comment.author = req.user._id;
        } else {
            res
                .status(403)
                .json(['You must be logged in to post a new comment.']);
                return;
        }

        comment.thread = threadId;

        commentModel
            .createComment(comment)
            .then(
                function (comment) {
                    res.json(comment);
                },
                function (error) {
                    log.error('Error creating comment.', error);
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }

    function findCommentByThread(req, res) {
        var threadId = req.params.threadId;
        commentModel
            .findCommentByThread(threadId)
            .then(
                function (comments) {
                    if (comments) {
                        res.json(comments);
                    } else {
                        res
                            .status(404)
                            .json(['Comments not found.']);
                    }
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }

    function updateComment(req, res) {
        var commentId = req.params.commentId;
        var changes = req.body;

        commentModel
            .updateThread(commentId, changes)
            .then(
                function (comment) {
                    if (comment) {
                        res.json(comment);
                    } else {
                        res
                            .status(404)
                            .json(['Comment not found.']);
                    }
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }
}
