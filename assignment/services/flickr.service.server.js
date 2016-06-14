module.exports = function(app) {
    var rp = require('request-promise');
    var biome = require('../lib/biome.js')();
    var auth = biome.get([
        'FLICKR_API_KEY',
        'FLICKR_API_SECRET',
    ]);

    app.get('/api/services/flickr/search', searchFlickrPhotos);

    function searchFlickrPhotos(req, res) {
        if (req.query.query) {
            var options = {
                uri: 'https://api.flickr.com/services/rest/',
                qs: {
                    method: 'flickr.photos.search',
                    format: 'json',
                    api_key: auth.FLICKR_API_KEY,
                    text: escape(req.query.query),
                },
                headers: {
                    'User-Agent': 'webdev-troettis',
                },
            };
            rp(options)
                .then(
                    function (success) {
                        var json = stripFlickrApiWrapper(success);
                        res.json(json);
                    },
                    function (error) {
                        res
                            .status(500)
                            .send(error)
                            .end();
                    });
        } else {
            res
                .status(400)
                .send('No search query provided.')
                .end();
        }
    }

    function stripFlickrApiWrapper(json_string) {
        json_string = json_string.replace('jsonFlickrApi(', '');
        json_string = json_string.substring(0, json_string.length - 1);
        return json_string;
    }
};
