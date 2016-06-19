module.exports = function () {
    var mongoose = require('mongoose');

    var DislikeSchema = mongoose.Schema({
        thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    }, { collection: 'project.dislike' });

    return DislikeSchema;
};
