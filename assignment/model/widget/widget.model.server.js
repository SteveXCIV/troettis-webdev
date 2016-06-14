module.exports = function() {
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
                    widgetId = widget._id;
                    dbWidget = widget;
                    return Page.findById(pageId);
                },
                function (error) {
                    throw error;
                })
            .then(
                function (page) {
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
                    throw error;
                })
            .then(
                function (result) {
                    if (!result.nModified) {
                        throw 404;
                    } else {
                        return dbWidget;
                    }
                },
                function (error) {
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

    function updateWidget(widgetId, widget) {
        return Widget
                .update(
                    { _id: widgetId },
                    { $set:
                        {
                            pageIndex: widget.pageIndex,
                            name: widget.name,
                            text: widget.text,
                            placeholder: widget.placeholder,
                            description: widget.description,
                            url: widget.url,
                            width: widget.width,
                            height: widget.height,
                            rows: widget.rows,
                            size: widget.size,
                            class: widget.class,
                            icon: widget.icon,
                            deletable: widget.deletable,
                            formatted: widget.formatted,
                        }
                    });
    }

    function deleteWidget(widgetId) {
        return Widget
            .findById(widgetId)
            .then(
                function (widget) {
                    return Page.findById(page._widget);
                },
                function (error) {
                    throw error;
                })
            .then(
                function (page) {
                    var widgets = page.widgets;
                    var index = widgets.findIndex((e, _i, _a) => e == widgetId);
                    if (index === -1) {
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
                    throw error;
                })
            .then(
                function (result) {
                    if (!result.nModified) {
                        throw 404;
                    }
                    return Widget.findByIdAndRemove(widgetId);
                },
                function (error) {
                    throw error;
                });
    }

    function reorderWidget(pageId, start, end) {
        return Page
            .findById(pageId)
            .then(
                function (page) {
                    if (start < 0 ||
                        end < 0 ||
                        start >= page.widgets.length ||
                        end >= page.widgets.length) {
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
                    throw error;
                });
    }
};
