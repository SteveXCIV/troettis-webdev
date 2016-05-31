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
            user = UserService.findUserByCredentials(user.username, user.password);
            if (user) {
                $location.url('/user/' + user._id);
            } else {
                vm.alert = 'Unable to login. Please check your credentials.';
            }
        }
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = register;

        function register(user) {
            user = UserService.createUser(user);
            if (user) {
                $location.url('/user/' + user._id);
            } else {
                vm.alert = 'Unable to register. An unknown error occurred.';
            }
        }
    }

    function ProfileController($routeParams, UserService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.updateUser = updateUser;

        function init() {
            vm.user = UserService.findUserById(vm.userId);
        }
        init();

        function updateUser(user) {
            var succ = UserService.updateUser(vm.userId, user);
            if (succ) {
                vm.success = 'Profile updated.';
            } else {
                vm.alert = 'Unable to update user.';
            }
        }
    }
})();
