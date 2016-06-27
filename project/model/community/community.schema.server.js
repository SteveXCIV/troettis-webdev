module.exports = function () {
    var mongoose = require('mongoose');
    var mUnique = require('mongoose-unique-validator');

    var CommunitySchema = mongoose.Schema({
        creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        dateCreated: { type: Date, default: Date.now, required: true },
        name: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
        description: { type: String, required: true },
    }, { collection: 'project.community' });
    CommunitySchema.plugin(mUnique, { message: 'The {PATH} "{VALUE}" is already in use.' });

    return CommunitySchema;
};
