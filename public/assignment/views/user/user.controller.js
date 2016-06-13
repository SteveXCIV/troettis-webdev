(function() {
    angular
        .module('WebAppMaker')
        .controller('LoginController', LoginController)
        .controller('RegisterController', RegisterController)
        .controller('ProfileController', ProfileController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(user) {
            UserService
                .findUserByCredentials(user.username, user.password)
                .then(
                    function(response) {
                        var user = response.data;
                        $location.url('/user/' + user._id);
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(user) {
            UserService
                .createUser(user)
                .then(
                    function(response) {
                        var user = response.data;
                        $location.url('/user/' + user._id);
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
    }

    function ProfileController($routeParams, $location, UserService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;

        function init() {
            UserService
                .findUserById(vm.userId)
                .then(
                    function(response) {
                        vm.user = response.data;
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
        init();

        function updateUser(user) {
            UserService
                .updateUser(vm.userId, user)
                .then(
                    function(response) {
                        vm.success = response.data;
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }

        function deleteUser() {
            UserService
                .deleteUser(vm.userId)
                .then(
                    function(response) {
                        $location.url('/');
                        vm.success = response.data;
                    },
                    function(error) {
                        vm.alert = error.data;
                    });
        }
    }
})();
