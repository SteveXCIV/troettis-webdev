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
    return api;

    function createPage(websiteId, page) {
        page._website = websiteId;
        var pageId = null;
        return Page
            .create(page)
            .then(
                function (page) {
                    pageId = page._id;
                    return Website.findById(websiteId);
                },
                function (error) {
                    throw error;
                })
            .then(
                function (website) {
                    var pages = website.pages;
                    pages.push(pageId);
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
                    return Website.findById(page._website);
                },
                function (error) {
                    throw error;
                })
            .then(
                function (website) {
                    var pages = website.pages;
                    var index = pages.findIndex((e, _i, _a) => e == pageId);
                    if (index === -1) {
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
                    throw error;
                })
            .then(
                function (result) {
                    if (!result.nModified) {
                        throw 404;
                    }
                    return Page.findByIdAndRemove(pageId);
                },
                function (error) {
                    throw error;
                });
    }
};
