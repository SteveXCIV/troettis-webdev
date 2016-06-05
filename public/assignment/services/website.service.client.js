(function() {
    angular
        .module('WebAppMaker')
        .factory('WebsiteService', WebsiteService);

    function WebsiteService() {
        var api = {
            'createWebsite':            createWebsite,
            'findWebsitesByUser':       findWebsitesByUser,
            'findWebsiteById':          findWebsiteById,
            'updateWebsite':            updateWebsite,
            'deleteWebsite':            deleteWebsite,
        };
        return api;

        function getNextWebsiteId() {
            var next = websites
                        .map((website, _i, _a) => parseInt(website._id))
                        .pop();
            next = next ? next : 100;
            return (next + 1).toString();
        }

        function createWebsite(userId, website) {
            website.developerId = userId;
            website._id = getNextWebsiteId();
            websites.push(website);
            return website;
        }

        function findWebsitesByUser(userId) {
            return websites
                    .filter((website, _i, _a) => website.developerId === userId);
        }

        function findWebsiteById(websiteId) {
            var maybeSite = websites
                                .filter((website, _i, _a) => website._id === websiteId)
                                .shift();
            return maybeSite ? maybeSite : null;
        }

        // Helper to find website index by id
        function getWebsiteIndexById(websiteId) {
            for (var i in websites) {
                if (websites[i]._id === websiteId) {
                    return i;
                }
            }
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
