(function() {
    angular
        .module('Project')
        .controller('CommunityExploreController', CommunityExploreController)
        .controller('CommunityCreateController', CommunityCreateController)
        .controller('CommunityEditController', CommunityEditController)
        .controller('CommunityViewController', CommunityViewController);

    function CommunityExploreController($http, CommunityService) {
        var vm = this;
        vm.communities = [];

        function init() {
            vm.alert = null;

            $http
                .get('/api/loggedin')
                .success(
                    function (user) {
                        if (user !== '0') {
                            vm.currentUser = user;
                        }
                    });

            CommunityService
                .findAllCommunities()
                .then(
                    function (response) {
                        vm.communities = response.data;
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }
        init();
    }

    function CommunityViewController($http, $routeParams, CommunityService, SubscriptionService, ThreadService) {
        var communityName = $routeParams['communityName'];
        var vm = this;
        vm.community = null;
        vm.threads = [];
        vm.subscription = false;
        vm.subscribe = subscribe;
        vm.unsubscribe = unsubscribe;
        vm.currentUser = null;

        function init() {
            vm.alert = null;

            $http
                .get('/api/loggedin')
                .then(
                    function (response) {
                        var user = response.data;
                        if (user !== '0') {
                            vm.currentUser = user;
                        }
                        return CommunityService.findCommunityByName(communityName);
                    })
                .then(
                    function (response) {
                        vm.community = response.data;
                        return ThreadService.findThreadByCommunity(vm.community._id);
                    })
                .then(
                    function (response) {
                        vm.threads = response.data;
                        if (vm.currentUser) {
                            return SubscriptionService.findSubscription(vm.currentUser._id, vm.community._id);
                        } else {
                            return false;
                        }
                    })
                .then(
                    function (response) {
                        vm.subscription = response.data || null;
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }
        init();

        function subscribe(userId, communityId) {
            SubscriptionService
                .createSubscription(userId, communityId)
                .then(
                    function (response) {
                        vm.subscription = response.data;
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }

        function unsubscribe(userId, communityId) {
            SubscriptionService
                .deleteSubscription(userId, communityId)
                .then(
                    function (response) {
                        vm.subscription = false;
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }
    }

    function CommunityCreateController($location, $window, CommunityService) {
        var vm = this;
        vm.back = () => $window.history.back();
        vm.createCommunity = createCommunity;

        function createCommunity(element, community) {
            if (element.$invalid) {
                return;
            }

            vm.alert = null;

            CommunityService
                .createCommunity(community)
                .then(
                    function (response) {
                        var community = response.data;
                        $location.url('/c/' + community.name);
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }
    }

    function CommunityEditController($location, $routeParams, $window, CommunityService) {
        var communityId = $routeParams['communityId'];
        var vm = this;
        vm.back = () => $window.history.back();
        vm.updateCommunity = updateCommunity;
        vm.community = null;

        function init() {
            vm.alert = null;

            CommunityService
                .findCommunityById(communityId)
                .then(
                    function (response) {
                        var community = response.data;
                        vm.community = community;
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }
        init();

        function updateCommunity(element, community) {
            if (element.$invalid) {
                return;
            }

            vm.alert = null;

            CommunityService
                .updateCommunity(communityId, community)
                .then(
                    function (response) {
                        var community = response.data;
                        console.log(community);
                        $location.url('/c/' + community.name);
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }
    }
})();
