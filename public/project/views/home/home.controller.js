(function() {
    angular
        .module('Project')
        .controller('HomeController', HomeController);

    function HomeController($http, ThreadService) {
        var vm = this;
        vm.currentUser = null;
        vm.threads = [];

        function init() {
            $http
                .get('/api/loggedin')
                .success(
                    function (user) {
                        if (user !== '0') {
                            vm.currentUser = user;
                        }
                    });
        }
        init();
    }
})();
