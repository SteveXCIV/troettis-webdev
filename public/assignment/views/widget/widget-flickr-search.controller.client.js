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

        vm.searchPhotos = function(query) {
            FlickrService
                .searchPhotos(query)
                .then(
                    function(response) {
                        var photos = response.data;
                        photos = photos.replace('jsonFlickrApi(', '');
                        photos = photos.substring(0, photos.length - 1);
                        vm.photos = JSON.parse(photos).photos;
                    },
                    function(error) {
                        vm.alert = error.data;
                    });
        }

        vm.selectPhoto = function(photo) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_b.jpg";
            WidgetService
                .updateWidget(vm.widgetId, { 'url': url })
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
