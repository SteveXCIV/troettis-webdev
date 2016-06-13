module.exports = function() {
    var mongoose = require('mongoose');
    var UserSchema = require('./user.schema.server.js')();
    var User = mongoose.model('User', UserSchema);

    var api = {
        'createUser':               createUser,
        'findUserByCredentials':    findUserByCredentials,
        'findUserById':             findUserById,
        'findUserByUsername':       findUserByUsername,
        'updateUser':               updateUser,
        'deleteUser':               deleteUser,
    };
    return api;

    function createUser(user) {
        return User.create(user);
    }

    function findUserByCredentials(username, password) {
        return User.findOne({
            username: username,
            password: password,
        });
    }

    function findUserById(userId) {
        return User.findById(userId);
    }

    function findUserByUsername(username) {
        return User.findOne({ username: username });
    }

    function updateUser(userId, user) {
        return User
                .update(
                    { _id: userId },
                    { $set:
                        {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            password: user.password,
                        }
                    });
    }

    function deleteUser(userId) {
        return User.findByIdAndRemove(userId);
    }
};