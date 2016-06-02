module.exports = function(app) {
    app.post('/api/user/:userId/website', createWebsite);
    app.get('/api/user/:userId/website', findAllWebsitesForUser);
    app.get('/api/website/:websiteId', findWebsiteById);
    app.put('/api/website/:websiteId', updateWebsite);
    app.delete('/api/website/:websiteId', deleteWebsite);

    function createWebsite(req, res) {
        console.log("function call createWebsite");
    }

    function findAllWebsitesForUser(req, res) {
        console.log("function call findAllWebsitesForUser");
    }

    function findWebsiteById(req, res) {
        console.log("function call findWebsiteById");
    }

    function updateWebsite(req, res) {
        console.log("function call updateWebsite");
    }

    function deleteWebsite(req, res) {
        console.log("function call deleteWebsite");
    }
}
