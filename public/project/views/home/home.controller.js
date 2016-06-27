(function() {
    angular
        .module('Project')
        .controller('HomeController', HomeController)
        .controller('SubscriptionController', SubscriptionController);

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

    function SubscriptionController($http, SubscriptionService) {
        var vm = this;
        vm.currentUser = null;
        vm.communities = [];

        function init() {
            $http
                .get('/api/loggedin')
                .then(
                    function (response) {
                        var user = response.data;
                        if (user !== '0') {
                            vm.currentUser = user;
                            return SubscriptionService.findSubscriptionsForUser(user._id);
                        }
                    })
                .then(
                    function (response) {
                        var subscriptions = response.data;
                        vm.communities = subscriptions.map((sub, _i, _a) => sub.community);
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }
        init();
    }
})();
