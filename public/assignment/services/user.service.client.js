(function() {
    angular
        .module('WebAppMaker')
        .factory('UserService', UserService);

    function UserService($http) {
        var api = {
            'createUser':               createUser,
            'findUserById':             findUserById,
            'findUserByUsername':       findUserByUsername,
            'login':                    login,
            'logout':                   logout,
            'updateUser':               updateUser,
            'deleteUser':               deleteUser,
        };
        return api;

        function createUser(user) {
            var url = '/api/user';
            return $http.post(url, user);
        }

        function findUserById(userId) {
            var url = '/api/user/' + userId;
            return $http.get(url);
        }

        function findUserByUsername(username) {
            var url = '/api/user?username=' + username;
            return $http.get(url);
        }

        function login(user) {
            return $http.post('/api/login', user);
        }

        function logout() {
            return $http.post('/api/logout');
        }

        function updateUser(userId, user) {
            var url = '/api/user/' + userId;
            return $http.put(url, user);
        }

        function deleteUser(userId) {
            var url = '/api/user/' + userId;
            return $http.delete(url);
        }
    }
})();
