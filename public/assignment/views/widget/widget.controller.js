(function() {
    angular
        .module('WebAppMaker')
        .controller('WidgetListController', WidgetListController)
        .controller('NewWidgetController', NewWidgetController)
        .controller('EditWidgetController', EditWidgetController);

    function WidgetListController($routeParams, WidgetService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];

        function init() {
            vm.widgets = WidgetService.findWidgetsByPageId(vm.pageId);
            console.log('widgets ' + JSON.stringify(vm.widgets));
        }
        init();
    }

    function NewWidgetController($routeParams, $location WidgetService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];
        vm.createWidget = createWidget;

        function createWidget(widget) {
            var succ = WidgetService.createWidget(vm.pageId, widget);
            if (succ) {
                $location.url('/user/' + vm.userId + '/website/' + vm.websiteId + '/page/' + vm.pageId);
            } else {
                vm.alert = 'Error creating widget.';
            }
        }
    }

    function EditWidgetController($routeParams, WidgetService) {
        var vm = this;
        vm.widgetId = $routeParams['wgid'];

        function init() {
            vm.widget = WidgetService.findWidgetById(vm.widgetId);
        }
        init();
    }
})();
