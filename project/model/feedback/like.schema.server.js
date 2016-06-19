module.exports = function () {
    var mongoose = require('mongoose');

    var LikeSchema = mongoose.Schema({
        thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    }, { collection: 'project.like' });

    return LikeSchema;
};
