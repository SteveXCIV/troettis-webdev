module.exports = function() {
    var mongoose = require('mongoose');
    var WebsiteSchema = require('./website.schema.server.js')();
    var Website = mongoose.model('Website', WebsiteSchema);
    var User = mongoose.model('User');

    var api = {
        'createWebsiteForUser': createWebsiteForUser,
        'findAllWebsitesForUser': findAllWebsitesForUser,
        'findWebsiteById': findWebsiteById,
        'updateWebsite': updateWebsite,
        'deleteWebsite': deleteWebsite,
    };
    return api;

    function createWebsiteForUser(userId, website) {
        var websiteId = null;
        website._user = userId;
        return Website
            .create(website)
            .then(
                function (website) {
                    websiteId = website._id;
                    return User.findById(userId);
                },
                function (error) {
                    throw error;
                })
            .then(
                function (user) {
                    var websites = user.websites;
                    websites.push(websiteId);
                    return User
                            .update(
                                { _id: userId },
                                { $set:
                                    {
                                        websites: websites,
                                    }
                                });
                },
                function (error) {
                    throw error;
                })
            .then(
                function (result) {
                    if (!result.nModified) {
                        throw 404;
                    } else {
                        return 200;
                    }
                },
                function (error) {
                    throw error;
                });
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
        return Website
            .findById(websiteId)
            .then(
                function (website) {
                    return User.findById(website._user);
                },
                function (error) {
                    throw error;
                })
            .then(
                function (user) {
                    var websites = user.websites;
                    var index = websites.findIndex((e, _i, _a) => e == websiteId);
                    if (index === -1) {
                        throw 404;
                    }
                    websites.splice(index, 1);
                    return User
                            .update(
                                { _id: user._id },
                                { $set:
                                    {
                                        websites: websites,
                                    }
                                });
                },
                function (error) {
                    throw error;
                })
            .then(
                function (result) {
                    if (!result.nModified) {
                        throw 404;
                    }
                    return Website.findByIdAndRemove(websiteId);
                },
                function (error) {
                    throw error;
                });
    }
};
