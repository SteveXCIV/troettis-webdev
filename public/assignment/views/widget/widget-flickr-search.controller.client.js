(function() {
    angular
        .module('WebAppMaker')
        .controller('FlickrImageSearchController', FlickrImageSearchController);

    function FlickrImageSearchController($routeParams, $location, FlickrService, WidgetService) {
        var vm = this;
        vm.userId = $routeParams['uid'];
        vm.websiteId = $routeParams['wid'];
        vm.pageId = $routeParams['pid'];
        vm.widgetId = $routeParams['wgid'];

        function init() {
            // HACK: quick hack to avoid the blank name issue
            WidgetService
                .findWidgetById(vm.widgetId)
                .then(
                    function (response) {
                        vm.widget = response.data;
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }
        init();

        vm.searchPhotos = function(query) {
            FlickrService
                .searchPhotos(query)
                .then(
                    function(response) {
                        var photos = response.data;
                        vm.photos = JSON.parse(photos).photos;
                    },
                    function(error) {
                        vm.alert = error.data;
                    });
        }

        vm.selectPhoto = function(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";
            WidgetService
                .updateWidget(vm.widgetId, { 'name': vm.widget.name, 'url': url })
                .then(
                    function(response) {
                        $location.url('/user/' + vm.userId + '/website/' + vm.websiteId + '/page/' + vm.pageId + '/widget/' + vm.widgetId);
                    },
                    function(error) {
                        vm.alert = error.data;
                    });
        }
    }
})();
