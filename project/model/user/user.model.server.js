module.exports = function (app) {
    var mongoose = require('mongoose');
    var UserSchema = require('./user.schema.server.js')();
    var User = mongoose.model('User', UserSchema);

    var api = {
        'registerUser':         registerUser,
        'findUserById':         findUserById,
        'findUserByUsername':   findUserByUsername,
        'updateUserProfile':    updateUserProfile,
        'deleteUser':           deleteUser,
        '$model':               User,
    };
    return api;

    function registerUser(user) {
        return User.create(user);
    }

    function findUserById(userId) {
        return User.findById(userId);
    }

    function findUserByUsername(username) {
        return User.findOne({ username: username });
    }

    function updateUserProfile(userId, changes) {
        return User
                .update(
                    { _id: userId },
                    { $set: {
                        firstName: changes.firstName,
                        lastName: changes.lastName,
                        contacts: changes.contacts,
                    }});
    }

    function deleteUser(userId) {
        return User.findByIdAndRemove(userId);
    }
};
