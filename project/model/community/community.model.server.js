module.exports = function () {
    var mongoose = require('mongoose');
    var CommunitySchema = require('./community.schema.server.js')();
    var Community = mongoose.model('Community', CommunitySchema);

    var api = {
        'createCommunity': createCommunity,
        'findAllCommunities': findAllCommunities,
        'findCommunityByName': findCommunityByName,
        'findCommunityById': findCommunityById,
        'updateCommunity': updateCommunity,
    };
    return api;

    function createCommunity(community) {
        return Community.create(community);
    }

    function findAllCommunities() {
        return Community
            .find()
            .populate({ path: 'creator', select: 'username' });
    }

    function findCommunityByName(communityName) {
        return Community.findOne({ name: communityName });
    }

    function findCommunityById(communityId) {
        return Community.findById(communityId);
    }

    function updateCommunity(communityId, community) {
        return Community
            .findOneAndUpdate(
                { _id: communityId },
                { $set: {
                    description: community.description,
                }},
                { new: true });
    }
};
