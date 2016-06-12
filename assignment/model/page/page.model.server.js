module.exports = function(app) {
    var mongoose = require('mongoose');
    var PageSchema = require('./page.schema.server.js')();
    var Page = mongoose.model('Page', PageSchema);

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
        return Page.create(page);
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
        return Page.findByIdAndRemove(pageId);
    }
};
