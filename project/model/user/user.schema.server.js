module.exports = function () {
    var mongoose = require('mongoose');
    var mUnique = require('mongoose-unique-validator');

    var UserSchema = mongoose.Schema({
        username: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
        password: { type: String, required: true },
        firstName: String,
        lastName: String,
        contacts: {
            email: { email: String },
            phone: { phone: String },
            facebook: { url: String },
            google: { url: String },
        },
        signUpDate: { type: Date, default: Date.now, required: true },
        facebook: {
            id: String,
            token: String,
        },
    }, { collection: 'project.user' });
    UserSchema.plugin(mUnique, { message: 'The {PATH} "{VALUE}" is already in use.' });

    return UserSchema;
};
