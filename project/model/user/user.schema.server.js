module.exports = function () {
    var mongoose = require('mongoose');
    var mUnique = require('mongoose-unique-validator');

    var ContactInfoSchema = mongoose.Schema({
        kind: {
            type: String,
            required: true,
            enum: [
                'EMAIL',
                'PHONE',
                'FACEBOOK',
                'TWITTER',
                'YOUTUBE',
                'GOOGLE',
            ],
        },
        value: { type: String, required: true },
    });

    var UserSchema = mongoose.Schema({
        username: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
        password: { type: String, required: true },
        firstName: String,
        lastName: String,
        subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
        threads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
        contacts: [ ContactInfoSchema ],
        signUpDate: { type: Date, default: Date.now, required: true },
    }, { collection: 'project.user' });
    UserSchema.plugin(mUnique, { message: 'The {PATH} "{VALUE}" is already in use.' });

    return UserSchema;
};
