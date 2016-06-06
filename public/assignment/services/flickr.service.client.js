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
            var key = '09a2edc33ac4772317639181b2be25d2';
            var secret = 'c83ac5c74de24bb644';
            var urlBase = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT';

            var url = urlBase.replace('API_KEY', key).replace('TEXT', query);
            return $http.get(url);
        }
    }
})();
