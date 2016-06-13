module.exports = function() {
    var mongoose = require('mongoose');
    var WidgetSchema = require('./widget.schema.server.js')();
    var Widget = mongoose.model('Widget', WidgetSchema);

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
        return Widget
            .count()
            .then(
                function(count) {
                    widget._index = count;
                },
                function(error) {
                    throw error;
                })
            .then(
                function(success) {
                    widget._page = pageId;
                    // hacks to prevent undefined cast
                    widget.rows = widget.rows || 0;
                    widget.size = widget.size || 0;
                    return Widget.create(widget);
                },
                function(error) {
                    throw error;
                });
    }

    function findAllWidgetsForPage(pageId) {
        return Widget
            .find({ _page: pageId })
            .sort({ _index: 'ascending' });
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
                            _index: widget._index,
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
        return Widget.findByIdAndRemove(widgetId);
    }

    function reorderWidget(pageId, start, end) {
        throw 500;
        // return Widget
        //     .find({ _page: pageId })
        //     .and({ $or:[
        //         { _index: start },
        //         { _index: end },
        //     ]})
        //     .then(
        //         function(widgets) {
        //
        //         },
        //         function(error) {
        //
        //         })
    }
};
