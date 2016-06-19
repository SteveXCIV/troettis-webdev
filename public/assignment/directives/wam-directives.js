(function() {
    angular
        .module('WebAppMaker')
        .directive('wamSortable', wamSortable)
        .directive('wamEqualTo', wamEqualTo);

    function wamSortable() {
        return {
            restrict: 'A',
            link: function ($scope, elm, attr) {
                var dragClassToggle = 'active';
                var start = null;
                var end = null;

                function startDrag(evt, ui) {
                    start = ui.item.index();
                    ui.item.toggleClass(dragClassToggle, true);
                }

                function endDrag(evt, ui) {
                    prev = ui.item.prev().index();
                    end = (prev == -1) ? 0 : prev + 1;
                    ui.item.toggleClass(dragClassToggle, false);

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
                    placeholder: 'widget-block',
                });
            }
        };
    }

    function wamEqualTo() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                thingToEqual: '=wamEqualTo',
            },
            link: function ($scope, element, attr, $model) {
                console.log($scope, element, attr, $model);
                $model.$validators.wamEqualTo = function ($value) {
                    return $value === $scope.thingToEqual;
                }

                $scope.$watch('thingToEqual', function () {
                    $model.$validate();
                });
            },
        };
    }
})();
