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

            ThreadService
                .findMostRecentThreads()
                .then(
                    function (response) {
                        vm.threads = response.data;
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }
        init();
    }
})();
