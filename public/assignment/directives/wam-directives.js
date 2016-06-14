(function() {
    angular
        .module('WebAppMaker')
        .directive('wamSortable', wamSortable);

    function wamSortable() {
        return {
            link: function ($scope, elm, attr) {
                console.log($scope);
                var start = null;
                var end = null;

                function startDrag(evt, ui) {
                    start = ui.item.attr('wam-index');
                }

                function endDrag(evt, ui) {
                    prev = ui.item.prev();
                    if (!prev || ! prev.attr('wam-index')) {
                        end = 0;
                    } else {
                        end = prev.attr('wam-index');
                    }

                    if (start != end) {
                        $scope.model.reorderWidgets(start, end);
                        start = end = null;
                    }
                }

                $(elm).sortable({
                    handle: '.ui-drag-handle',
                    axis: 'y',
                    start: startDrag,
                    stop: endDrag,
                });
            }
        }
    }
})();
