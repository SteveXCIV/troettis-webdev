(function() {
    angular
        .module('WebAppMaker')
        .controller('WidgetListController', WidgetListController)
        .controller('NewWidgetController', NewWidgetController)
        .controller('EditWidgetController', EditWidgetController);

    function WidgetListController($routeParams, $route, $sce, WidgetService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];
        vm.safeUrl = safeUrl;
        vm.reorderWidgets = reorderWidgets;

        function init() {
            WidgetService
                .findWidgetsByPageId(vm.pageId)
                .then(
                    function(response) {
                        vm.widgets = response.data;
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
        init();

        function safeUrl(url) {
            return $sce.trustAsResourceUrl(url);
        }

        function reorderWidgets(start, end) {
            WidgetService
                .reorderWidgets(vm.pageId, start, end)
                .then(
                    function (_response) {
                        $route.reload();
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }
    }

    function NewWidgetController($routeParams, $location, WidgetService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];
        vm.createWidget = createWidget;

        function createWidget(widgetType) {
            widget = { type: widgetType };
            switch (widgetType) {
                case 'HEADING':
                widget.size = 1;
                break;
            }
            WidgetService
                .createWidget(vm.pageId, widget)
                .then(
                    function(response) {
                        var widget = response.data;
                        $location.url('/user/' + vm.userId + '/website/' + vm.websiteId + '/page/' + vm.pageId + '/widget/' + widget._id);
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
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
            WidgetService
                .findWidgetById(vm.widgetId)
                .then(
                    function(response) {
                        vm.widget = response.data;
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
        init();

        function updateWidget(widget) {
            WidgetService
                .updateWidget(vm.widgetId, widget)
                .then(
                    function(response) {
                        $location.url('/user/' + vm.userId + '/website/' + vm.websiteId + '/page/' + vm.pageId + '/widget');
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }

        function deleteWidget() {
            WidgetService
                .deleteWidget(vm.widgetId)
                .then(
                    function(response) {
                        $location.url('/user/' + vm.userId + '/website/' + vm.websiteId + '/page/' + vm.pageId + '/widget');
                    },
                    function(error) {
                        vm.alert = error.data;
                    }
                );
        }
    }
})();
