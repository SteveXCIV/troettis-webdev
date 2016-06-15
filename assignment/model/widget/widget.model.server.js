module.exports = function(app) {
    var mongoose = require('mongoose');
    var WidgetSchema = require('./widget.schema.server.js')();
    var Widget = mongoose.model('Widget', WidgetSchema);
    var Page = mongoose.model('Page');

    var api = {
        'createWidget': createWidget,
        'findAllWidgetsForPage': findAllWidgetsForPage,
        'findWidgetById': findWidgetById,
        'updateWidget': updateWidget,
        'deleteWidget': deleteWidget,
        'reorderWidget': reorderWidget,
    };
    app.debug('Created widget model.');
    return api;

    function createWidget(pageId, widget) {
        widget._page = pageId;
        widget.rows = widget.rows || 0;
        widget.size = widget.size || 0;
        var widgetId = null;
        var dbWidget = null;
        return Widget
            .create(widget)
            .then(
                function (widget) {
                    app.debug(`Created widget ${widget._id}.`);
                    widgetId = widget._id;
                    dbWidget = widget;
                    return Page.findById(pageId);
                },
                function (error) {
                    app.error('Error creating widget.', error);
                    throw error;
                })
            .then(
                function (page) {
                    app.debug(`Found page ${page._id} to attach widget to.`);
                    var widgets = page.widgets;
                    widgets.push(widgetId);
                    return Page
                            .update(
                                { _id: pageId },
                                { $set:
                                    {
                                        widgets: widgets,
                                    }
                                });
                },
                function (error) {
                    app.error('Error finding page for widget.', error);
                    throw error;
                })
            .then(
                function (result) {
                    if (!(result.nModified || result.n)) {
                        app.error('Error updating page.', error);
                        throw 404;
                    } else {
                        app.debug('Updated page successfully.');
                        return dbWidget;
                    }
                },
                function (error) {
                    app.error('Error adding widget to page.', error);
                    throw error;
                });
    }

    function findAllWidgetsForPage(pageId) {
        return Page
                .findById(pageId)
                .populate('widgets')
                .then(
                    function (page) {
                        return page.widgets;
                    },
                    function (error) {
                        throw error;
                    });
    }

    function findWidgetById(widgetId) {
        return Widget.findById(widgetId);
    }

    function updateWidget(widgetId, updatedWidget) {
        return Widget
                .findById(widgetId)
                .then(
                    function (widget) {
                        return Widget.update(
                            { _id: widgetId },
                            { $set:
                                {
                                    name: updatedWidget.name,
                                    text: updatedWidget.text,
                                    placeholder: updatedWidget.placeholder,
                                    description: updatedWidget.description,
                                    url: updatedWidget.url,
                                    width: updatedWidget.width || widget.width,
                                    height: updatedWidget.height || widget.height,
                                    rows: updatedWidget.rows || widget.rows,
                                    size: updatedWidget.size || widget.size,
                                    class: updatedWidget.class,
                                    icon: updatedWidget.icon,
                                    deletable: updatedWidget.deletable,
                                    formatted: updatedWidget.formatted,
                                }
                            });
                    },
                    function (error) {
                        throw error;
                    });
    }

    function deleteWidget(widgetId) {
        return Widget
            .findById(widgetId)
            .then(
                function (widget) {
                    app.debug(`Found widget ${widget._id}.`);
                    return Page.findById(page._widget);
                },
                function (error) {
                    app.error('Error finding widget.', error);
                    throw error;
                })
            .then(
                function (page) {
                    app.debug(`Found page ${page._id} to detach widget.`);
                    var widgets = page.widgets;
                    var index = widgets.findIndex((e, _i, _a) => e == widgetId);
                    if (index === -1) {
                        app.error('Error finding widget.', page);
                        throw 404;
                    }
                    widget.splice(index, 1);
                    return Page
                            .update(
                                { _id: page._id },
                                { $set:
                                    {
                                        widgets: widgets,
                                    }
                                });
                },
                function (error) {
                    app.error('Error finding page.', error);
                    throw error;
                })
            .then(
                function (result) {
                    if (!(result.nModified || result.n)) {
                        app.error('Error updating page.', result);
                        throw 404;
                    }
                    return Widget.findByIdAndRemove(widgetId);
                },
                function (error) {
                    app.error('Error removing widget from page.', error);
                    throw error;
                });
    }

    function reorderWidget(pageId, start, end) {
        return Page
            .findById(pageId)
            .then(
                function (page) {
                    app.debug(`Found page ${page._id} to reorder widget (${start}, ${end}).`);
                    if (start < 0 ||
                        end < 0 ||
                        start >= page.widgets.length ||
                        end >= page.widgets.length) {
                            app.error('Index out of bounds for widget reorder.');
                            throw 400;
                        }
                    widgets = page.widgets;
                    var tmp = widgets.splice(start, 1)[0];
                    widgets.splice(end, 0, tmp);
                    return Page
                        .update(
                            { _id: pageId },
                            { $set: {
                                widgets: widgets,
                            }});
                },
                function (error) {
                    app.error('Error finding page to reorder widget.', error);
                    throw error;
                });
    }
};
