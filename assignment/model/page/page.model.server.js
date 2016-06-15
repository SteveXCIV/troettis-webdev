module.exports = function(app) {
    var mongoose = require('mongoose');
    var PageSchema = require('./page.schema.server.js')();
    var Page = mongoose.model('Page', PageSchema);
    var Website = mongoose.model('Website');

    var api = {
        'createPage': createPage,
        'findAllPagesForWebsite': findAllPagesForWebsite,
        'findPageById': findPageById,
        'updatePage': updatePage,
        'deletePage': deletePage,
    };
    app.debug('Created Page model.');
    return api;

    function createPage(websiteId, page) {
        page._website = websiteId;
        var pageId = null;
        return Page
            .create(page)
            .then(
                function (page) {
                    pageId = page._id;
                    app.debug(`Created page: ${page._id}.`);
                    return Website.findById(websiteId);
                },
                function (error) {
                    app.error('Error creating page.', error);
                    throw error;
                })
            .then(
                function (website) {
                    var pages = website.pages;
                    pages.push(pageId);
                    app.debug(`Adding page {$pageId} to website: ${website._id}.`);
                    return Website
                            .update(
                                { _id: websiteId },
                                { $set:
                                    {
                                        pages: pages,
                                    }
                                });
                },
                function (error) {
                    app.error('Error locating website to add to.', error);
                    throw error;
                })
            .then(
                function (result) {
                    if (!result.nModified) {
                        app.error('Failed to update website pages.', result);
                        throw 404;
                    } else {
                        app.debug(`Updated website: ${result}.`);
                        return 200;
                    }
                },
                function (error) {
                    app.error('Failed to add page to website.', error);
                    throw error;
                });
    }

    function findAllPagesForWebsite(websiteId) {
        return Page.find({ _website: websiteId });
    }

    function findPageById(pageId) {
        return Page.findById(pageId);
    }

    function updatePage(pageId, page) {
        return Page
                .update(
                    { _id: pageId },
                    { $set:
                        {
                            name: page.name,
                            title: page.title,
                            description: page.description,
                            widget: page.widgets,
                        }
                    });
    }

    function deletePage(pageId) {
        return Page
            .findById(pageId)
            .then(
                function (page) {
                    app.debug(`Found page: ${page._id}.`);
                    return Website.findById(page._website);
                },
                function (error) {
                    app.error('Error finding page.', error);
                    throw error;
                })
            .then(
                function (website) {
                    app.debug(`Found website: ${website._id}.`);
                    var pages = website.pages;
                    var index = pages.findIndex((e, _i, _a) => e == pageId);
                    if (index === -1) {
                        app.error('Error finding page on website.', 404);
                        throw 404;
                    }
                    pages.splice(index, 1);
                    return Website
                            .update(
                                { _id: website._id },
                                { $set:
                                    {
                                        pages: pages,
                                    }
                                });
                },
                function (error) {
                    app.error('Error finding website.', error);
                    throw error;
                })
            .then(
                function (result) {
                    if (!result.nModified) {
                        app.error('Error modifying website.', result);
                        throw 404;
                    }
                    return Page.findByIdAndRemove(pageId);
                },
                function (error) {
                    app.error('Error removing page from website.', error);
                    throw error;
                });
    }
};
