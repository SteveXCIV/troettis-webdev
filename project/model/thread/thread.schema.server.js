module.exports = function () {
    var mongoose = require('mongoose');

    var ThreadSchema = mongoose.Schema({
        community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        creationDate: { type: Date, default: Date.now, required: true },
        editDate: Date,
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
        dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dislike' }],
        body: String,
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    });

    return ThreadSchema;
};
