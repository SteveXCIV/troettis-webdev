module.exports = function () {
    var mongoose = require('mongoose');

    var ModeratorSchema = mongoose.Schema({
        community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    }, { collection: 'project.moderator' });

    return ModeratorSchema;
};
