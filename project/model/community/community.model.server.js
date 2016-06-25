module.exports = function (app) {
    var mongoose = require('mongoose');
    var CommunitySchema = require('./community.schema.server.js')();
    var Community = mongoose.model('Community', CommunitySchema);

    var api = {
        'createCommunity': createCommunity,
        'findCommunityByName': findCommunityByName,
        'findCommunityById': findCommunityById,
        'updateCommunity': updateCommunity,
    };
    return api;

    function createCommunity(community) {
        return Community.create(community);
    }

    function findCommunityByName(communityName) {
        return Community
            .findOne({ name: communityName })
            .then(
                function (community) {
                    if (community) {
                        return community;
                    } else {
                        throw 404;
                    }
                });
    }

    function findCommunityById(communityId) {
        return Community
            .findById(communityId)
            .then(
                function (community) {
                    if (community) {
                        return community;
                    } else {
                        throw 404;
                    }
                });
    }

    function updateCommunity(communityId, community) {
        return Community
            .findOneAndUpdate(
                { _id: communityId },
                { $set: {
                    description: community.description,
                }},
                { new: true })
            .then(
                function (community) {
                    if (community) {
                        return community;
                    } else {
                        throw 404;
                    }
                });
    }
};
