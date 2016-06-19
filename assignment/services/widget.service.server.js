module.exports = function(app, models) {
    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    var widgetModel = models.widgetModel;

    app.post('/api/page/:pageId/widget', createWidget);
    app.get('/api/page/:pageId/widget', findAllWidgetsForPage);
    app.get('/api/widget/:widgetId', findWidgetById);
    app.put('/api/widget/:widgetId', updateWidget);
    app.delete('/api/widget/:widgetId', deleteWidget);
    app.post('/api/upload', upload.single('file'), uploadImage);
    app.put('/api/page/:pageId/widget', routeWidgetUpdateRequest);

    function createWidget(req, res) {
        var pageId = req.params.pageId;
        var widget = req.body;

        widgetModel
            .createWidget(pageId, widget)
            .then(
                function(widget) {
                    res.json(widget);
                },
                function(error) {
                    res
                        .status(500)
                        .send(error);
                });
    }

    function findAllWidgetsForPage(req, res) {
        var pageId = req.params.pageId;

        widgetModel
            .findAllWidgetsForPage(pageId)
            .then(
                function(widgets) {
                    res.json(widgets);
                },
                function(error) {
                    res
                        .status(404)
                        .send(error);
                });
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;

        widgetModel
            .findWidgetById(widgetId)
            .then(
                function(widget) {
                    res.json(widget);
                },
                function(error) {
                    res
                        .status(404)
                        .send(error);
                });
    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var updatedWidget = req.body;

        if (!updatedWidget.name) {
            res
                .status(400)
                .send('Name must not be left blank.');
            return;
        }

        widgetModel
            .updateWidget(widgetId, updatedWidget)
            .then(
                function(status) {
                    if (status['nModified'] != 1) {
                        res
                            .status(200)
                            .send('No changes made.');
                    } else {
                        res
                            .status(200)
                            .send('Widget updated.');
                    }
                },
                function(error) {
                    res
                        .status(500)
                        .send('Server error while processing request.');
                });
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;

        widgetModel
            .deleteWidget(widgetId)
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

    function uploadImage(req, res) {
        var widgetId = req.body.widgetId;
        var pageId = req.body.pageId;
        var websiteId = req.body.websiteId;
        var userId = req.body.userId;

        app.debug(`Image upload request for widget ${widgetId}.`);

        var redirectUrl = '/assignment/#/user/' + userId + '/website/' + websiteId + '/page/' + pageId + '/widget/' + widgetId;

        app.debug(`When done will redirect to ${redirectUrl}.`);

        var width = req.body.width;
        var url = '/uploads/' + req.file.filename;

        app.debug(`Stored image at ${url}.`);

        widgetModel
            .updateWidget(
                widgetId,
                {
                    width: width,
                    url: url,
                })
            .then(
                function (response) {
                    if (!(response.nModified || response.n)) {
                        res
                            .status(500)
                            .send('Failed to update widget.');
                    } else {
                        res
                            .status(200)
                            .redirect(redirectUrl);
                    }
                },
                function (error) {
                    res
                        .status(500)
                        .send(error);
                });
    }

    function routeWidgetUpdateRequest(req, res) {
        if (req.query.start &&
            req.query.end) {
            reorderWidget(req, res);
        } else {
            res.sendStatus(400);
        }
    }

    function reorderWidget(req, res) {
        var pageId = req.params.pageId;
        var start = req.query.start;
        var end = req.query.end;

        widgetModel
            .reorderWidget(pageId, start, end)
            .then(
                function(success) {
                    res
                        .status(200)
                        .send('Widgets reordered.');
                },
                function(error) {
                    res
                        .status(400)
                        .send('Unable to reorder widgets.');
                });
    }
}
