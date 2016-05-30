(function() {
    angular
        .module('WebAppMaker')
        .factory('WebsiteService', WebsiteService);

    function WebsiteService() {
        var websites = [{
            "_id": "123",
            "name": "Facebook",
            "developerId": "456"
        }, {
            "_id": "234",
            "name": "Tweeter",
            "developerId": "456"
        }, {
            "_id": "456",
            "name": "Gizmodo",
            "developerId": "456"
        }, {
            "_id": "567",
            "name": "Tic Tac Toe",
            "developerId": "123"
        }, {
            "_id": "678",
            "name": "Checkers",
            "developerId": "123"
        }, {
            "_id": "789",
            "name": "Chess",
            "developerId": "234"
        }];

        var api = {
            'createWebsite':            createWebsite,
            'findWebsitesByUser':       findWebsitesByUser,
            'findWebsiteById':          findWebsiteById,
            'updateWebsite':            updateWebsite,
            'deleteWebsite':            deleteWebsite,
        };
        return api;

        function createWebsite(userId, website) {
            website.developerId = userId;
            websites.push(website);
            return true;
        }

        function findWebsitesByUser(userId) {
            return websites
                    .filter((website, _i, _a) => website.developerId === userId);
        }

        function findWebsiteById(websiteId) {
            var maybeSite = websites
                                .fiter((website, _i, _a) => website._id === websiteId)
                                .shift();
            return maybeSite ? maybeSite : null;
        }

        // Helper to find website index by id
        function getWebsiteIndexById(websiteId) {
            return websites
                    .filter((website, _i, _a) => website._id === websiteId)
                    .map((_w, index, _a) => index)
                    .shift();
        }

        function updateWebsite(websiteId, website) {
            var index = getWebsiteIndexById(websiteId);
            if (index) {
                websites[index] = website;
                return true;
            }
            return false;
        }

        function deleteWebsite(websiteId) {
            var index = getWebsiteIndexById(websiteId);
            if (index) {
                websites.splice(index, 1);
                return true;
            }
            return false;
        }
    }
})();
