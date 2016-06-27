module.exports = function () {
    var findCommunityByName = require('./findCommunityByName')();
    var findUserByUsername = require('./findUserByUsername')();
    var register = require('./register')();
    var updateUser = require('./updateUser')();

    var api = {
        findCommunityByName: findCommunityByName,
        findUserByUsername: findUserByUsername,
        register: register,
        updateUser: updateUser,
    };
    return api;
};
