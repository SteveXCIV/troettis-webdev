module.exports = function(app, models) {
    var websiteModel = models.websiteModel;

    app.post('/api/user/:userId/website', createWebsite);
    app.get('/api/user/:userId/website', findAllWebsitesForUser);
    app.get('/api/website/:websiteId', findWebsiteById);
    app.put('/api/website/:websiteId', updateWebsite);
    app.delete('/api/website/:websiteId', deleteWebsite);

    function createWebsite(req, res) {
        var userId = req.params.userId;
        var website = req.body;

        if (!website.name) {
            res
                .status(400)
                .send('Wesbite name must not be blank.');
            return;
        }

        websiteModel.createWebsiteForUser(userId, website)
            .then(
                function(website) {
                    res.json(website);
                },
                function(error) {
                    res
                        .status(500)
                        .send(error);
                });
    }

    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;

        websiteModel.findAllWebsitesForUser(userId)
            .then(
                function(websites) {
                    res.json(websites);
                },
                function(error) {
                    res
                        .status(404)
                        .send(error);
                });
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params.websiteId;

        websiteModel.findWebsiteById(websiteId)
            .then(
                function(website) {
                    res.json(website);
                },
                function(error) {
                    res
                        .status(404)
                        .send(error);
                });
    }

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var updatedSite = req.body;

        if (!updatedSite.name) {
            res
                .status(400)
                .send('Wesbite name must not be blank.');
            return;
        }

        websiteModel
            .updateWebsite(websiteId, updatedSite)
            .then(
                function(status) {
                    if (status['nModified'] != 1) {
                        res
                            .status(200)
                            .send('No changes made.');
                    } else {
                        res
                            .status(200)
                            .send('Website updated.');
                    }
                },
                function(error) {
                    res
                        .status(500)
                        .send('Server error while processing request.');
                });
    }

    function deleteWebsite(req, res) {
        var websiteId = req.params.websiteId;

        websiteModel
            .deleteWebsite(websiteId)
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
