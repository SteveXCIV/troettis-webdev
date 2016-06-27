module.exports = function () {
    var mongoose = require('mongoose');
    var CommentSchema = require('./comment.schema.server.js')();
    var Comment = mongoose.model('Comment', CommentSchema);

    var api = {
        'createComment': createComment,
        'findCommentByThread': findCommentByThread,
        'updateComment': updateComment,
    };
    return api;

    function createComment(thread) {
        return Comment
            .create(thread)
            .then(
                function (thread) {
                    return Comment
                        .findById(thread._id)
                        .populate({ path: 'thread', select: 'community', populate: { path: 'community', select: 'name'} })
                        .populate({ path: 'author', select: 'username' });
                });
    }

    function findCommentByThread(threadId) {
        return Comment
            .find({ thread: threadId })
            .sort('-creationDate')
            .populate({ path: 'thread', select: 'community', populate: { path: 'community', select: 'name'} })
            .populate({ path: 'author', select: 'username' });
    }

    function updateComment(commentId, comment) {
        return Comment
            .findOneAndUpdate(
                { _id: commentId },
                { $set: {
                    body: comment.body,
                    editDate: Date.now(),
                }},
                { new: true });
    }
};
