module.exports = function(app) {
    app.post('/api/website/:websiteId/page', createPage);
    app.get('/api/website/:websiteId/page', findAllPagesForWebsite);
    app.get('/api/page/:pageId', findPageById);
    app.put('/api/page/:pageId', updatePage);
    app.delete('/api/page/:pageId', deletePage);

    function createPage(req, res) {
        console.log("function call createPage");
    }

    function findAllPagesForWebsite(req, res) {
        console.log("function call findAllPagesForWebsite");
    }

    function findPageById(req, res) {
        console.log("function call findPageById");
    }

    function updatePage(req, res) {
        console.log("function call updatePage");
    }

    function deletePage(req, res) {
        console.log("function call deletePage");
    }
}
