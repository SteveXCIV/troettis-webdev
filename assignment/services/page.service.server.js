module.exports = function(app) {
    var pages = [{
        "_id": "321",
        "name": "Post 1",
        "websiteId": "456"
    }, {
        "_id": "432",
        "name": "Post 2",
        "websiteId": "456"
    }, {
        "_id": "543",
        "name": "Post 3",
        "websiteId": "456"
    }];

    app.post('/api/website/:websiteId/page', createPage);
    app.get('/api/website/:websiteId/page', findAllPagesForWebsite);
    app.get('/api/page/:pageId', findPageById);
    app.put('/api/page/:pageId', updatePage);
    app.delete('/api/page/:pageId', deletePage);

    function createPage(req, res) {
        var websiteId = req.params.websiteId;
        var newPage = req.body;

        newPage.websiteId = websiteId;
        newPage._id = app.getNextId();

        pages.push(newPage);

        res.json(newPage);
    }

    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var matches = pages
                        .filter((page, _i, _a) => page.websiteId === websiteId);
        res.json(matches);
    }

    function findPageById(req, res) {
        var pageId = req.params.pageId;
        var maybePage = pages
                            .filter((page, _i, _a) => page._id === pageId)
                            .shift();
        if (maybePage) {
            res.json(maybePage);
        } else {
            res
                .status(404)
                .send(`Page ${pageId} not found.`)
                .end();
        }
    }

    function getPageIndexById(pageId) {
        for (var i in pages) {
            if (pages[i]._id === pageId) {
                return i;
            }
        }
    }

    function updatePage(req, res) {
        var pageId = req.params.pageId;
        var updatedPage = req.body;
        var maybeIndex = getPageIndexById(pageId);

        if (maybeIndex) {
            oldPage = pages[maybeIndex];
            updatedPage._id = oldPage._id;
            updatedPage.websiteId = oldPage.websiteId;
            pages[maybeIndex] = updatedPage;
            res.json(updatedPage);
        } else {
            res
                .status(404)
                .send(`Page with ID ${pageId} not found.`)
                .end();
        }
    }

    function deletePage(req, res) {
        var pageId = req.params.pageId;
        var maybeIndex = getPageIndexById(pageId);
        if (maybeIndex) {
            pages.splice(maybeIndex, 1);
            res
                .status(200)
                .send(`Page ${pageId} deleted.`);
        } else {
            res
                .status(404)
                .send(`Page with ID ${pageId} not found.`)
                .end();
        }
    }
}
