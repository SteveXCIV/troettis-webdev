module.exports = function () {
    var mongoose = require('mongoose');

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
        username: { type: String, required: true },
        password: { type: String, required: true },
        fistName: String,
        lastName: String,
        subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
        threads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
        contacts: [ ContactInfoSchema ],
        signUpDate: { type: Date, default: Date.now, required: true },
    }, { collection: 'project.user' });

    return UserSchema;
};
