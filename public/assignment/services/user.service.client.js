(function() {
    angular
        .module('WebAppMaker')
        .factory('UserService', UserService);

    function UserService() {
        var api = {
            'createUser':               createUser,
            'findUserById':             findUserById,
            'findUserByUsername':       findUserByUsername,
            'findUserByCredentials':    findUserByCredentials,
            'updateUser':               updateUser,
            'deleteUser':               deleteUser,
        };
        return api;

        function getNextUserId() {
            var next = users
                        .map((user, _i, _a) => parseInt(user._id))
                        .pop();
            next = next ? next : 100;
            return (next + 1).toString();
        }

        function createUser(user) {
            user._id = getNextUserId();
            if (user.password === user.verifyPassword) {
                delete user.verifyPassword;
            } else {
                return false;
            }
            users.push(user);
            return user;
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
            for (var i in users) {
                if (users[i]._id === userId) {
                    return i;
                }
            }
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
