(function() {
    angular
        .module('WebAppMaker')
        .factory('UserService', UserService);

    function UserService() {
        var users = [{
            _id: "123",
            username: "alice",
            password: "alice",
            firstName: "Alice",
            lastName: "Wonder"
        }, {
            _id: "234",
            username: "bob",
            password: "bob",
            firstName: "Bob",
            lastName: "Marley"
        }, {
            _id: "345",
            username: "charly",
            password: "charly",
            firstName: "Charly",
            lastName: "Garcia"
        }, {
            _id: "456",
            username: "jannunzi",
            password: "jannunzi",
            firstName: "Jose",
            lastName: "Annunzi"
        }];

        var api = {
            'createUser':               createUser,
            'findUserById':             findUserById,
            'findUserByUsername':       findUserByUsername,
            'findUserByCredentials':    findUserByCredentials,
            'updateUser':               updateUser,
            'deleteUser':               deleteUser,
        };
        return api;

        function createUser(user) {
            users.push(user);
        }

        function findUserById(userId) {
            var maybeUser = users
                                .filter((user, _i, _a) => user._id === userId)
                                .shift();
            return maybeUser ? maybeUser : null;
        }

        function findUserByUsername(username) {
            var maybeUser = users
                                .filter((user, _i, _a) => user.username === username)
                                .shift();
            return maybeUser ? maybeUser : null;
        }

        function findUserByCredentials(username, password) {
            var maybeUser = findUserByUsername(username);
            return (maybeUser && maybeUser.password === password) ? maybeUser : null;
        }

        // Helper function to retrieve user index
        function getUserIndexById(userId) {
            return users
                    .filter((user, _i, _a) => user._id === userId)
                    .map((_u, index, _a) => index)
                    .shift();
        }

        function updateUser(userId, user) {
            var index = getUserIndexById(userId);
            if (index) {
                users[index] = user;
                return true;
            }
            return false;
        }

        function deleteUser(userId) {
            var index = getUserIndexById(userId);
            if (index) {
                users.splice(index, 1);
                return true;
            }
            return false;
        }
    }
})();
