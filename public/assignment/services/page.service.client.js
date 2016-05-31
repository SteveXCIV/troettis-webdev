(function() {
    angular
        .module('WebAppMaker')
        .factory('PageService', PageService);

    function PageService() {
        var pages = [{
            "_id": "321",
            "name": "Post 1",
            "websiteId": "456"
        }, {
            "_id": "432",
            "name": "Post 2",
            "websiteId": "456"
        }, {
            "_id": "543",
            "name": "Post 3",
            "websiteId": "456"
        }];

        var api = {
            'createPage':               createPage,
            'findPageByWebsiteId':      findPageByWebsiteId,
            'findPageById':             findPageById,
            'updatePage':               updatePage,
            'deletePage':               deletePage,
        };
        return api;

        function getNextPageId() {
            var next = pages
                        .map((page, _i, _a) => parseInt(page._id))
                        .pop();
            next = next ? next : 100;
            return (next + 1).toString();
        }

        function createPage(websiteId, page) {
            page.websiteId = websiteId;
            page._id = getNextPageId();
            pages.push(page);
            return page;
        }

        function findPageByWebsiteId(websiteId) {
            return pages
                    .filter((page, _i, _a) => page.websiteId === websiteId);
        }

        function findPageById(pageId) {
            var maybePage = pages
                                .filter((page, _i, _a) => page._id === pageId)
                                .shift();
            return maybePage ? maybePage : null;
        }

        // Helper to get page index
        function getPageIndexById(pageId) {
            for (var i in pages) {
                if (pages[i]._id === pageId) {
                    return i;
                }
            }
        }

        function updatePage(pageId, page) {
            var index = getPageIndexById(pageId);
            if (index) {
                pages[index] = page;
                return true;
            }
            return false;
        }

        function deletePage(pageId) {
            var index = getPageIndexById(pageId);
            if (index) {
                pages.splice(index, 1);
                return true;
            }
            return false;
        }
    }
})();
