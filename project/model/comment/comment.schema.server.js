module.exports = function () {
    var mongoose = require('mongoose');

    var CommentSchema = mongoose.Schema({
        thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        creationDate: { type: Date, default: Date.now, required: true },
        editDate: Date,
        body: { type: String, required: true },
    });

    return CommentSchema;
};
