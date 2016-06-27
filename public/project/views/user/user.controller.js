(function() {
    angular
        .module('Project')
        .controller('LoginController', LoginController)
        .controller('RegisterController', RegisterController)
        .controller('ProfileController', ProfileController)
        .controller('ProfileEditController', ProfileEditController);

    function LoginController($location, $rootScope, UserService) {
        var vm = this;
        vm.login = login;

        function login(element, user) {
            if (element.$invalid) {
                return;
            }

            vm.alert = null;

            UserService
                .login(user)
                .then(
                    function(response) {
                        var user = response.data;
                        $rootScope.currentUser = user;
                        $location.url('/');
                    },
                    function(error) {
                        if (typeof(error.data) === 'string') {
                            vm.alert = [error.data];
                        } else {
                            vm.alert = error.data;
                        }
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

            vm.alert = null;

            UserService
                .register(user)
                .then(
                    function(response) {
                        var user = response.data;
                        $rootScope.currentUser = user;
                        $location.url('/profile/edit');
                    },
                    function(error) {
                        if (typeof(error.data) === 'string') {
                            vm.alert = [error.data];
                        } else {
                            vm.alert = error.data;
                        }
                    }
                );
        }
    }

    function ProfileController($routeParams, $window, UserService) {
        var vm = this;
        vm.username = $routeParams['username'];
        vm.back = back;

        function init() {
            UserService
                .findUserByUsername(vm.username)
                .then(
                    function (response) {
                        vm.user = response.data;
                    },
                    function (error) {
                        if (typeof(error.data) === 'string') {
                            vm.alert = [error.data];
                        } else {
                            vm.alert = error.data;
                        }
                    });
        }
        init();

        function back() {
            $window.history.back();
        }
    }

    function ProfileEditController($rootScope, $routeParams, $location, UserService) {
        var vm = this;
        vm.logout = logout;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;

        function init() {
            UserService
                .findCurrentUser()
                .then(
                    function(response) {
                        vm.user = response.data;
                    },
                    function(error) {
                        if (typeof(error.data) === 'string') {
                            vm.alert = [error.data];
                        } else {
                            vm.alert = error.data;
                        }
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
                        if (typeof(error.data) === 'string') {
                            vm.alert = [error.data];
                        } else {
                            vm.alert = error.data;
                        }
                    });
        }

        function updateUser(user) {
            vm.success = null;
            vm.alert = null;
            UserService
                .updateUser(vm.user._id, user)
                .then(
                    function(response) {
                        if (response.status === 200) {
                            vm.success = 'Profile updated!';
                        }
                    },
                    function(error) {
                        if (typeof(error.data) === 'string') {
                            vm.alert = [error.data];
                        } else {
                            vm.alert = error.data;
                        }
                    }
                );
        }

        function deleteUser() {
            UserService
                .deleteUser(vm.user._id)
                .then(
                    function(response) {
                        $location.url('/');
                        vm.success = response.data;
                    },
                    function(error) {
                        if (typeof(error.data) === 'string') {
                            vm.alert = [error.data];
                        } else {
                            vm.alert = error.data;
                        }
                    });
        }
    }
})();
