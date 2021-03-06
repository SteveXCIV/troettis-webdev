(function() {
    angular
        .module('WebAppMaker')
        .controller('LoginController', LoginController)
        .controller('RegisterController', RegisterController)
        .controller('ProfileController', ProfileController);

    function LoginController($location, $rootScope, UserService) {
        var vm = this;
        vm.login = login;

        function login(element, user) {
            if (element.$invalid) {
                return;
            }
            
            UserService
                .login(user)
                .then(
                    function(response) {
                        var user = response.data;
                        $rootScope.currentUser = user;
                        $location.url('/user/' + user._id);
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
    }

    function RegisterController($location, $rootScope, UserService) {
        var vm = this;
        vm.register = register;

        function register(element, user) {
            if (element.$invalid) {
                return;
            }

            UserService
                .register(user)
                .then(
                    function(response) {
                        var user = response.data;
                        $rootScope.currentUser = user;
                        $location.url('/user/' + user._id);
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
    }

    function ProfileController($rootScope, $routeParams, $location, UserService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.logout = logout;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;

        function init() {
            // HACK: Figure out a better way to redirect from /user w/o :uid
            if (!vm.userId) {
                if ($rootScope.currentUser) {
                    $location.url('/user/' + $rootScope.currentUser._id);
                } else {
                    $location.url('/login');
                }
                // break out here so the controller doesn't request undefined
                return;
            }

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

        function logout() {
            UserService
                .logout()
                .then(
                    function (response) {
                        $rootScope.currentUser = null;
                        $location.url('/');
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }

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
