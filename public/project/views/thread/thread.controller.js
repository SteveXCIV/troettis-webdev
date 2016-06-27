(function() {
    angular
        .module('Project')
        .controller('ThreadCreateController', ThreadCreateController)
        .controller('ThreadViewController', ThreadViewController);

    function ThreadViewController($http, $routeParams, ThreadService) {
        // var communityId = $routeParams['communityId'];
        // var vm = this;
        // vm.community = null;
        // vm.threads = [];
        //
        // function init() {
        //     vm.alert = null;
        //
        //     $http
        //         .get('/api/loggedin')
        //         .success(
        //             function (user) {
        //                 if (user !== '0') {
        //                     vm.currentUser = user;
        //                 }
        //             });
        //
        //     ThreadService
        //         .findThreadByName(communityId)
        //         .then(
        //             function (response) {
        //                 vm.community = response.data;
        //                 return ThreadService.findThreadByThread(vm.community._id);
        //             })
        //         .then(
        //             function (response) {
        //                 vm.threads = response.data;
        //             },
        //             function (error) {
        //                 vm.alert = error.data;
        //             });
        // }
        // init();
    }

    function ThreadCreateController($location, $routeParams, $window, ThreadService) {
        var communityId = $routeParams['communityId'];
        var vm = this;
        vm.back = () => $window.history.back();
        vm.createThread = createThread;

        function createThread(element, thread) {
            if (element.$invalid) {
                return;
            }

            vm.alert = null;

            ThreadService
                .createThread(communityId, thread)
                .then(
                    function (response) {
                        var thread = response.data;
                        $location.url('/c/' + thread.community.name + '/thread/' + thread._id);
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }
    }
})();
