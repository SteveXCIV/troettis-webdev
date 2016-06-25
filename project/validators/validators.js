module.exports = function () {
    var findUserByUsername = require('./findUserByUsername')();
    var register = require('./register')();
    var updateUser = require('./updateUser')();

    var api = {
        findUserByUsername: findUserByUsername,
        register: register,
        updateUser: updateUser,
    };
    return api;
};
