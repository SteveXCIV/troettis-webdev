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

        // createPage(websiteId, page) - adds the page parameter instance to the local pages array. The new page's websiteId is set to the websiteId parameter
        // findPageByWebsiteId(websiteId) - retrieves the pages in local pages array whose websiteId matches the parameter websiteId
        // findPageById(pageId) - retrieves the page in local pages array whose _id matches the pageId parameter
        // updatePage(pageId, page) - updates the page in local pages array whose _id matches the pageId parameter
        // deletePage(pageId) - removes the page from local pages array whose _id matches the pageId parameter

        function createPage(websiteId, page) {
            page.websiteId = websiteId;
            pages.push(page);
            return true;
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
            return pages
                    .filter((page, _i, _a) => page._id === pageId)
                    .map((_p, index, _a) => index)
                    .shift();
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
