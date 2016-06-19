module.exports = function () {
    var mongoose = require('mongoose');

    var AnnouncementSchema = mongoose.Schema({
        community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
        thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
    }, { collection: 'project.announcement' });

    return AnnouncementSchema;
};
