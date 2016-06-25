module.exports = function() {
    var mongoose = require('mongoose');
    var UserSchema = require('./user.schema.server.js')();
    var User = mongoose.model('User', UserSchema);

    var api = {
        'registerUser': registerUser,
        'findUserById': findUserById,
        'findUserByUsername': findUserByUsername,
        'updateUser': updateUser,
        'deleteUser': deleteUser,
    };
    return api;

    function registerUser(user) {
        return User.create(user);
    }

    function findUserById(userId) {
        return User.findById(userId);
    }

    function findUserByUsername(username) {
        return User
            .findOne({
                username: username
            });
    }

    function updateUser(userId, changes) {
        return User
            .findOneAndUpdate({
                _id: userId
            }, {
                $set: {
                    password: changes.password,
                    firstName: changes.firstName,
                    lastName: changes.lastName,
                    contacts: changes.contacts,
                }
            }, {
                new: true
            });
    }

    function deleteUser(userId) {
        return User.findByIdAndRemove(userId);
    }
};
