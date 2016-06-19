module.exports = function () {
    var mongoose = require('mongoose');

    var CommunitySchema = mongoose.Schema({
        creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        dateCreated: { type: Date, default: Date.now, required: true },
        moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Moderator' }],
        subscribers [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        name: { type: String, required: true },
        description: { type: String, required: true },
        announcements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Announcement' }],
        threads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
        private: Boolean,
    });

    return CommunitySchema;
};
