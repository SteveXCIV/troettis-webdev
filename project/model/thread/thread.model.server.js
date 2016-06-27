module.exports = function () {
    var mongoose = require('mongoose');
    var ThreadSchema = require('./thread.schema.server.js')();
    var Thread = mongoose.model('Thread', ThreadSchema);

    var api = {
        'createThread': createThread,
        'findMostRecentThreads': findMostRecentThreads,
        'findThreadByCommunity': findThreadByCommunity,
        'findThreadById': findThreadById,
        'updateThread': updateThread,
        'deleteThread': deleteThread,
    };
    return api;

    function createThread(thread) {
        return Thread
            .create(thread)
            .then(
                function (thread) {
                    return Thread
                        .findById(thread._id)
                        .populate({ path: 'community', select: 'name' })
                        .populate({ path: 'author', select: 'username' });
                });
    }

    function findMostRecentThreads() {
        return Thread
            .find()
            .limit(25)
            .sort('-creationDate')
            .populate({ path: 'community', select: 'name' })
            .populate({ path: 'author', select: 'username' });
    }

    function findThreadByCommunity(communityId) {
        return Thread
            .find({ community: communityId })
            .sort('-creationDate')
            .populate({ path: 'community', select: 'name' })
            .populate({ path: 'author', select: 'username' });
    }

    function findThreadById(threadId) {
        return Thread
            .findById(threadId)
            .populate({ path: 'community', select: 'name' })
            .populate({ path: 'author', select: 'username' });
    }

    function updateThread(threadId, thread) {
        return Thread
            .findOneAndUpdate(
                { _id: threadId },
                { $set: {
                    body: thread.body,
                    editDate: Date.now(),
                }},
                { new: true });
    }

    function deleteThread(threadId) {
        return Thread.findByIdAndRemove(threadId);
    }
};
