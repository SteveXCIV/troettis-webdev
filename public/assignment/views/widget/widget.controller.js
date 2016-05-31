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

    function NewWidgetController($routeParams, $location, WidgetService) {
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

    function EditWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];
        vm.widgetId = $routeParams['wgid'];
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;

        function init() {
            vm.widget = WidgetService.findWidgetById(vm.widgetId);
            console.log(JSON.stringify(vm.widget))
        }
        init();

        function updateWidget(widget) {
            var succ = WidgetService.updateWidget(vm.widgetId, widget);
            if (succ) {
                $location.url('/user/' + vm.userId + '/website/' + vm.websiteId + '/page/' + vm.pageId + '/widget');
            } else {
                vm.alert = 'Error updating widget.';
            }
        }

        function deleteWidget() {
            var succ = WidgetService.deleteWidget(vm.widgetId);
            if (succ) {
                $location.url('/user/' + vm.userId + '/website/' + vm.websiteId + '/page/' + vm.pageId + '/widget');
            } else {
                vm.alert = 'Error deleting widget.';
            }
        }
    }
})();
