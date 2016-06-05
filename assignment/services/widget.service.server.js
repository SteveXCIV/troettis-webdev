module.exports = function(app) {
    var widgets = [{
        "_id": "123",
        "widgetType": "HEADER",
        "pageId": "321",
        "size": 2,
        "text": "GIZMODO"
    }, {
        "_id": "234",
        "widgetType": "HEADER",
        "pageId": "321",
        "size": 4,
        "text": "Lorem ipsum"
    }, {
        "_id": "345",
        "widgetType": "IMAGE",
        "pageId": "321",
        "width": "100%",
        "url": "http://lorempixel.com/400/200/"
    }, {
        "_id": "456",
        "widgetType": "HTML",
        "pageId": "321",
        "text": "<p>Lorem ipsum</p>"
    }, {
        "_id": "567",
        "widgetType": "HEADER",
        "pageId": "321",
        "size": 4,
        "text": "Lorem ipsum"
    }, {
        "_id": "678",
        "widgetType": "YOUTUBE",
        "pageId": "321",
        "width": "100%",
        "url": "https://youtu.be/AM2Ivdi9c4E"
    }, {
        "_id": "789",
        "widgetType": "HTML",
        "pageId": "321",
        "text": "<p>Lorem ipsum</p>"
    }];

    app.post('/api/page/:pageId/widget', createWidget);
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);
    app.put('/api/widget/:widgetId', updateWidget);
    app.delete('/api/widget/:widgetId', deleteWidget);

    function createWidget(req, res) {
        var pageId = req.params.pageId;
        var widget = req.body;

        widget.pageId = pageId;
        widget._id = app.getNextId();
        widgets.push(widget);

        res.json(widget);
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;

        var pageWidgets = widgets
            .filter((widget, _i, _a) => widget.pageId === pageId);

        res.json(pageWidgets);
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        var maybeWidget = widgets
            .filter((widget, _i, _a) => widget._id === widgetId)
            .shift();

        if (maybeWidget) {
            res.json(maybeWidget);
        } else {
            res
                .status(404)
                .send(`No widget with ID ${widgetId} exists.`)
                .end();
        }
    }

    function getWidgetIndexById(widgetId) {
        for (var i in widgets) {
            if (widgets[i]._id === widgetId) {
                return i;
            }
        }
    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var updatedWidget = req.body;
        var maybeIndex = getWidgetIndexById(widgetId);

        if (maybeIndex) {
            var widget = widgets[maybeIndex];
            switch (widget.widgetType) {
                case 'HEADER':
                widget.text = updatedWidget.text;
                widget.size = updatedWidget.size;
                break;
                case 'IMAGE':
                widget.url = updatedWidget.url;
                widget.width = updatedWidget.width;
                break;
                case 'YOUTUBE':
                widget.url = updatedWidget.url;
                widget.width = updatedWidget.width;
                break;
            }
            widgets[maybeIndex] = widget;
            res.json(widget);
        } else {
            res
                .status(404)
                .send(`No widget with ID ${widgetId} exists.`)
                .end();
        }
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        var updatedWidget = req.body;
        var maybeIndex = getWidgetIndexById(widgetId);

        if (maybeIndex) {
            widgets.splice(maybeIndex, 1);
            res
                .status(200)
                .send(`Widget ${widgetId} deleted.`)
                .end();
        } else {
            res
                .status(404)
                .send(`No widget with ID ${widgetId} exists.`)
                .end();
        }
    }
}
