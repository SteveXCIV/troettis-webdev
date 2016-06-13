module.exports = function() {
    var mongoose = require('mongoose');
    var WebsiteSchema = require('./website.schema.server.js')();
    var Website = mongoose.model('Website', WebsiteSchema);

    var api = {
        'createWebsiteForUser': createWebsiteForUser,
        'findAllWebsitesForUser': findAllWebsitesForUser,
        'findWebsiteById': findWebsiteById,
        'updateWebsite': updateWebsite,
        'deleteWebsite': deleteWebsite,
    };
    return api;

    function createWebsiteForUser(userId, website) {
        website._user = userId;
        return Website.create(website);
    }

    function findAllWebsitesForUser(userId) {
        return Website.find({ _user: userId });
    }

    function findWebsiteById(websiteId) {
        return Website.findById(websiteId);
    }

    function updateWebsite(websiteId, website) {
        return Website
                .update(
                    { _id: websiteId },
                    { $set:
                        {
                            name: website.name,
                            description: website.description,
                            pages: website.pages,
                        }
                    });
    }

    function deleteWebsite(websiteId) {
        return Website.findByIdAndRemove(websiteId);
    }
};
