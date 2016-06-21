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
        return User
            .findById(userId)
            .then(
                function (user) {
                    if (user) {
                        return user;
                    } else {
                        throw 404;
                    }
                });
    }

    function findUserByUsername(username) {
        return User
            .findOne({ username: username })
            .then(
                function (user) {
                    if (user) {
                        return user;
                    } else {
                        throw 404;
                    }
                });
    }

    function updateUserProfile(userId, changes) {
        return User
                .findOneAndUpdate(
                    { _id: userId },
                    { $set: {
                        firstName: changes.firstName,
                        lastName: changes.lastName,
                        contacts: changes.contacts,
                    }},
                    { new: true })
                .then(
                    function (user) {
                        if (user) {
                            return user;
                        } else {
                            throw 404;
                        }
                    });
    }

    function deleteUser(userId) {
        return User
            .findByIdAndRemove(userId)
            .then(
                function (user) {
                    if (user) {
                        return user;
                    } else {
                        throw 404;
                    }
                });
    }
};
