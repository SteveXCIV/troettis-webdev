(function() {
    angular
        .module('WebAppMaker')
        .factory('FlickrService', FlickrService);

    function FlickrService($http) {
        var api = {
            'searchPhotos': searchPhotos,
        };
        return api;

        function searchPhotos(query) {
            var url = '/api/services/flickr/search?query=' + query;
            return $http.get(url);
        }
    }
})();
