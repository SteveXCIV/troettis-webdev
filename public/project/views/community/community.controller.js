(function() {
    angular
        .module('Project')
        .controller('CommunityExploreController', CommunityExploreController)
        .controller('CommunityCreateController', CommunityCreateController);

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
                        $location.url('/community/' + community.name);
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }
    }
})();
