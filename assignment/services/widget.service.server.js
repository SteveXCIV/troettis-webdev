module.exports = function(app) {
    app.post('/api/page/:pageId/widget', createWidget);
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);
    app.put('/api/widget/:widgetId', updateWidget);
    app.delete('/api/widget/:widgetId', deleteWidget);

    function createWidget(req, res) {
        console.log("function call createWidget");
    }

    function findAllWidgetsForPage(req, res) {
        console.log("function call findAllWidgetsForPage");
    }

    function findWidgetById(req, res) {
        console.log("function call findWidgetById");
    }

    function updateWidget(req, res) {
        console.log("function call updateWidget");
    }

    function deleteWidget(req, res) {
        console.log("function call deleteWidget");
    }
}
