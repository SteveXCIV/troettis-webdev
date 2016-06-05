module.exports = function(app) {
    var websites = [{
        "_id": "123",
        "name": "Facebook",
        "developerId": "456"
    }, {
        "_id": "234",
        "name": "Tweeter",
        "developerId": "456"
    }, {
        "_id": "456",
        "name": "Gizmodo",
        "developerId": "456"
    }, {
        "_id": "567",
        "name": "Tic Tac Toe",
        "developerId": "123"
    }, {
        "_id": "678",
        "name": "Checkers",
        "developerId": "123"
    }, {
        "_id": "789",
        "name": "Chess",
        "developerId": "234"
    }];

    app.post('/api/user/:userId/website', createWebsite);
    app.get('/api/user/:userId/website', findAllWebsitesForUser);
    app.get('/api/website/:websiteId', findWebsiteById);
    app.put('/api/website/:websiteId', updateWebsite);
    app.delete('/api/website/:websiteId', deleteWebsite);

    function createWebsite(req, res) {
        var userId = req.params.userId;
        var website = req.body;

        website.developerId = userId;
        website._id = app.getNextId();
        websites.push(website);

        res.json(website);
    }

    function findAllWebsitesForUser(req, res) {
        var userId = req.params.userId;

        var userSites = websites
                .filter((website, _i, _a) => website.developerId === userId);

        res.json(userSites);
    }

    function findWebsiteById(req, res) {
        var websiteId = req.params.websiteId;

        var maybeSite = websites
                            .filter((website, _i, _a) => website._id === websiteId)
                            .shift();

        if (maybeSite) {
            res.json(maybeSite);
        } else {
            res
                .status(404)
                .send(`No website with ID ${websiteId} exists.`)
                .end();
        }
    }

    function getWebsiteIndexById(websiteId) {
        for (var i in websites) {
            if (websites[i]._id === websiteId) {
                return i;
            }
        }
    }

    function updateWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var updatedSite = req.body;
        var maybeIndex = getWebsiteIndexById(websiteId);

        if (maybeIndex) {
            var oldSite = websites[maybeIndex];
            updatedSite.developerId = oldSite.developerId;
            updatedSite._id = oldSite._id;
            websites[maybeIndex] = updatedSite;
            res.json(updatedSite);
        } else {
            res
                .status(404)
                .send(`No website with ID ${websiteId} exists.`)
                .end();
        }
    }

    function deleteWebsite(req, res) {
        var websiteId = req.params.websiteId;
        var maybeIndex = getWebsiteIndexById(websiteId);

        if (maybeIndex) {
            websites.splice(maybeIndex, 1);
            res
                .status(200)
                .send(`Website ${websiteId} deleted.`)
                .end();
        } else {
            res
                .status(404)
                .send(`No website with ID ${websiteId} exists.`)
                .end();
        }
    }
}
