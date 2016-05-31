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
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();
    }

    function NewPageController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.createPage = createPage;

        function createPage(page) {
            var page = PageService.createPage(vm.userId, page);
            if (page) {
                $location.url('/user/' + vm.userId + '/website/' + vm.websiteId + '/page');
            } else {
                vm.alert = 'Error creating page.';
            }
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
            vm.page = PageService.findPageById(vm.pageId);
        }
        init();

        function updatePage(page) {
            var succ = PageService.updatePage(vm.pageId, page);
            if (succ) {
                $location.url('/user/' + vm.userId + '/website/' + vm.websiteId + '/page');
            } else {
                vm.alert = 'Error updating page.';
            }
        }

        function deletePage() {
            var succ = PageService.deletePage(vm.pageId);
            if (succ) {
                $location.url('/user/' + vm.userId + '/website/' + vm.websiteId + '/page');
            } else {
                vm.alert = 'Error deleting page.';
            }
        }
    }
})();
