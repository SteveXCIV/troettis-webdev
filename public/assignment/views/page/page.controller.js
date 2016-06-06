(function() {
    angular
        .module('WebAppMaker')
        .controller('PageListController', PageListController)
        .controller('NewPageController', NewPageController)
        .controller('EditPageController', EditPageController);

    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];

        function init() {
            PageService
                .findPageByWebsiteId(vm.websiteId)
                .then(
                    function(response) {
                        vm.pages = response.data;
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
        init();
    }

    function NewPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.createPage = createPage;

        function createPage(page) {
            PageService
                .createPage(vm.websiteId, page)
                .then(
                    function(response) {
                        $location.url('/user/' + vm.userId + '/website/' + vm.websiteId + '/page');
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
    }

    function EditPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.pageId = $routeParams['pid'];
        vm.websiteId = $routeParams['wid'];
        vm.userId = $routeParams['uid'];
        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function init() {
            PageService
                .findPageById(vm.pageId)
                .then(
                    function(response) {
                        vm.page = response.data;
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
        init();

        function updatePage(page) {
            PageService
                .updatePage(vm.pageId, page)
                .then(
                    function(response) {
                        $location.url('/user/' + vm.userId + '/website/' + vm.websiteId + '/page');
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }

        function deletePage() {
            PageService
                .deletePage(vm.pageId)
                .then(
                    function(response) {
                        $location.url('/user/' + vm.userId + '/website/' + vm.websiteId + '/page');
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
    }
})();
