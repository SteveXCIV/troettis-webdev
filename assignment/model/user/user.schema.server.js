module.exports = function() {
    var mongoose = require('mongoose');

    var FacebookUserSchema = mongoose.Schema({
        id: String,
        token: String,
    });

    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        websites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Website' }],
        dateCreated: { type: Date, default: Date.now },
        facebook: FacebookUserSchema,
    }, { collection: 'assignment.user' });

    return UserSchema;
};
