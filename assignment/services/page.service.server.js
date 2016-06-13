module.exports = function(app, models) {
    var pageModel = models.pageModel;

    app.post('/api/website/:websiteId/page', createPage);
    app.get('/api/website/:websiteId/page', findAllPagesForWebsite);
    app.get('/api/page/:pageId', findPageById);
    app.put('/api/page/:pageId', updatePage);
    app.delete('/api/page/:pageId', deletePage);

    function createPage(req, res) {
        var websiteId = req.params.websiteId;
        var newPage = req.body;

        pageModel.createPage(websiteId, newPage)
            .then(
                function(page) {
                    res.json(page);
                },
                function(error) {
                    res
                        .status(500)
                        .send(error);
                });
    }

    function findAllPagesForWebsite(req, res) {
        var websiteId = req.params.websiteId;

        pageModel.findAllPagesForWebsite(websiteId)
            .then(
                function (pages) {
                    res.json(pages);
                },
                function (error) {
                    res
                        .status(500)
                        .send(error);
                });
    }

    function findPageById(req, res) {
        var pageId = req.params.pageId;

        pageModel.findPageById(pageId)
            .then(
                function(page) {
                    res.json(page);
                },
                function (error) {
                    res
                        .status(500)
                        .send(error);
                });
    }

    function updatePage(req, res) {
        var pageId = req.params.pageId;
        var updatedPage = req.body;

        pageModel
            .updatePage(pageId, updatedPage)
            .then(
                function(status) {
                    if (status['nModified'] != 1) {
                        res
                            .status(200)
                            .send('No changes made.');
                    } else {
                        res
                            .status(200)
                            .send('Page updated.');
                    }
                },
                function(error) {
                    res
                        .status(500)
                        .send('Server error while processing request.');
                });
    }

    function deletePage(req, res) {
        var pageId = req.params.pageId;

        pageModel
            .deletePage(pageId)
            .then(
                function(status) {
                    res.sendStatus(200);
                },
                function(error) {
                    res
                        .status(500)
                        .send(error);
                });
    }
}
