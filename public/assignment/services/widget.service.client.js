(function() {
    angular
        .module('WebAppMaker')
        .factory('WidgetService', WidgetService);

    function WidgetService() {
        var api = {
            'createWidget': createWidget,
            'findWidgetsByPageId': findWidgetsByPageId,
            'findWidgetById': findWidgetById,
            'updateWidget': updateWidget,
            'deleteWidget': deleteWidget,
        };
        return api;

        function getNextWidgetId() {
            var next = widgets
                        .map((widget, _i, _a) => parseInt(widget._id))
                        .pop();
            next = next ? next : 100;
            return (next + 1).toString();
        }

        function createWidget(pageId, widget) {
            widget.pageId = pageId;
            widget._id = getNextWidgetId();
            widgets.push(widget);
            console.log(JSON.stringify(widget));
            return widget;
        }

        function findWidgetsByPageId(pageId) {
            return widgets
                .filter((widget, _i, _a) => widget.pageId === pageId);
        }

        function findWidgetById(widgetId) {
            var maybeWidget = widgets
                .filter((widget, _i, _a) => widget._id === widgetId)
                .shift();
            return maybeWidget ? maybeWidget : null;
        }

        // Helper to get widget index by id
        function getWidgetIndexById(widgetId) {
            for (var i in widgets) {
                if (widgets[i]._id === widgetId) {
                    return i;
                }
            }
        }

        function updateWidget(widgetId, widget) {
            var index = getWidgetIndexById(widgetId);
            if (index) {
                widgets[index] = widget;
                return true;
            }
            return false;
        }

        function deleteWidget(widgetId) {
            var index = getWidgetIndexById(widgetId);
            if (index) {
                widgets.splice(index, 1);
                return true;
            }
            return false;
        }
    }
})();
