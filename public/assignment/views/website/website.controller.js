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
            vm.websites = WebsiteService.findWebsitesByUser(vm.userId);
        }
        init();
    }

    function NewWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.createWebsite = createWebsite;

        function createWebsite(website) {
            var site = WebsiteService.createWebsite(vm.userId, website);
            if (site) {
                $location.url('/user/' + vm.userId + '/website');
            } else {
                vm.alert = 'Error creating website.';
            }
        }
    }

    function EditWebsiteController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.websiteId = $routeParams['wid'];
        vm.userId = $routeParams['uid'];
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        function init() {
            vm.website = WebsiteService.findWebsiteById(vm.websiteId);
        }
        init();

        function updateWebsite(website) {
            var succ = WebsiteService.updateWebsite(vm.websiteId, website);
            if (succ) {
                $location.url('/user/' + vm.userId + '/website');
            } else {
                vm.alert = 'Error updating website.';
            }
        }

        function deleteWebsite() {
            var succ = WebsiteService.deleteWebsite(vm.websiteId);
            if (succ) {
                $location.url('/user/' + vm.userId + '/website');
            } else {
                vm.alert = 'Error deleting website.';
            }
        }
    }
})();
