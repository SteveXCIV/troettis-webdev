module.exports = function(app, models) {
    var err = require('./errorHandler')();
    var log = require('../../lib/logger')();
    var validate = require('express-validation');
    var validators = require('../validators/validators')();
    var communityModel = models.communityModel;

    app.post('/api/community', createCommunity);
    app.get('/api/community/all', findAllCommunities);
    app.get('/api/community', validate(validators.findCommunityByName), findCommunityByName);
    app.get('/api/community/:communityId', findCommunityById);
    app.put('/api/community/:communityId', updateCommunity);

    function createCommunity(req, res) {
        var community = req.body;

        if (req.user) {
            community.creator = req.user._id;
        } else {
            res
                .status(400)
                .json(['You must be logged in to start a new community.']);
            return;
        }

        communityModel
            .createCommunity(community)
            .then(
                function (community) {
                    return community;
                })
            .then(
                function (community) {
                    res.json(community);
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }

    function findAllCommunities(req, res) {
        communityModel
            .findAllCommunities()
            .then(
                function (communities) {
                    res.json(communities);
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }

    function findCommunityByName(req, res) {
        var name = req.query.name;
        communityModel
            .findCommunityByName(name)
            .then(
                function (community) {
                    if (community) {
                        res.json(community);
                    } else {
                        res
                            .status(404)
                            .json(['Community not found.']);
                    }
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }

    function findCommunityById(req, res) {
        var communityId = req.params.communityId;
        communityModel
            .findCommunityById(communityId)
            .then(
                function (community) {
                    if (community) {
                        res.json(community);
                    } else {
                        res
                            .status(404)
                            .json(['Community not found.']);
                    }
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }

    function updateCommunity(req, res) {
        var communityId = req.params.communityId;
        var changes = req.body;

        log.debug(`Request to update community with ID ${communityId} and payload ${JSON.stringify(changes)}.`);

        if (!req.user) {
            res
                .status(403)
                .json(['You must be logged in to do that.']);
            return;
        }

        communityModel
            .findCommunityById(communityId)
            .then(
                function (community) {
                    if (!community.creator.equals(req.user._id)) {
                        res
                            .status(403)
                            .json(['You must be the creator to edit a community.']);
                        return false;
                    } else {
                        return communityModel.updateCommunity(communityId, changes);
                    }
                })
            .then(
                function (community) {
                    if (community) {
                        log.debug(`Database response ${JSON.stringify(community)}.`);
                        res.json(community);
                    } else {
                        res
                            .status(404)
                            .json(['Community not found.']);
                    }
                },
                function (error) {
                    res
                        .status(400)
                        .json(err.convertDbError(error));
                });
    }
}
