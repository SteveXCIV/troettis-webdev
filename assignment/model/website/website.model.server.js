module.exports = function(app) {
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
    app.debug('Created Website model.');
    return api;

    function createWebsiteForUser(userId, website) {
        var websiteId = null;
        website._user = userId;
        return Website
            .create(website)
            .then(
                function (website) {
                    app.debug(`Created website ${website._id}.`);
                    websiteId = website._id;
                    return User.findById(userId);
                },
                function (error) {
                    app.error('Error creating website.', error);
                    throw error;
                })
            .then(
                function (user) {
                    app.debug(`Found user ${user._id} to attach website ${websiteId}.`);
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
                    app.error('Error finding user for website.', error);
                    throw error;
                })
            .then(
                function (result) {
                    if (!(result.nModified || result.n)) {
                        app.error('Error updating user websites.', result);
                        throw 404;
                    } else {
                        app.debug(`Added website ${websiteId} to user.`);
                        return 200;
                    }
                },
                function (error) {
                    app.error('Error adding website to user.', error);
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
                    app.debug(`Found website ${website._id}.`);
                    return User.findById(website._user);
                },
                function (error) {
                    app.error('Error finding website.', error);
                    throw error;
                })
            .then(
                function (user) {
                    app.debug(`Found user ${user._id} to detach website from.`);
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
                    app.error('Error finding user.', error);
                    throw error;
                })
            .then(
                function (result) {
                    if (!(result.nModified || result.n)) {
                        app.error('Error updating website.', result);
                        throw 404;
                    }
                    return Website.findByIdAndRemove(websiteId);
                },
                function (error) {
                    app.error('Error removing website from user.', error);
                    throw error;
                });
    }
};
