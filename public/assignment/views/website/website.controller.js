(function() {
    angular
        .module('WebAppMaker')
        .controller('WebsiteListController', WebsiteListController)
        .controller('NewWebsiteController', NewWebsiteController)
        .controller('EditWebsiteController', EditWebsiteController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams['uid'];

        function init() {
            WebsiteService
                .findWebsitesByUser(vm.userId)
                .then(
                    function(response) {
                        vm.websites = response.data;
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
        init();
    }

    function NewWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.createWebsite = createWebsite;

        function createWebsite(element, website) {
            if (element.$invalid) {
                return;
            }

            var site = WebsiteService
                .createWebsite(vm.userId, website)
                .then(
                    function(response) {
                        $location.url('/user/' + vm.userId + '/website');
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
    }

    function EditWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.websiteId = $routeParams['wid'];
        vm.userId = $routeParams['uid'];
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        function init() {
            WebsiteService
                .findWebsiteById(vm.websiteId)
                .then(
                    function(response) {
                        vm.website = response.data;
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
        init();

        function updateWebsite(element, website) {
            if (element.$invalid) {
                return;
            }
            
            WebsiteService
                .updateWebsite(vm.websiteId, website)
                .then(
                    function(response) {
                        $location.url('/user/' + vm.userId + '/website');
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }

        function deleteWebsite() {
            var succ = WebsiteService
                .deleteWebsite(vm.websiteId)
                .then(
                    function(response) {
                        $location.url('/user/' + vm.userId + '/website');
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
    }
})();
