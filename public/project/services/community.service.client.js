(function() {
    angular
        .module('Project')
        .factory('CommunityService', CommunityService);

    function CommunityService($http) {
        var api = {
            'createCommunity': createCommunity,
            'findAllCommunities': findAllCommunities,
            'findCommunityByName': findCommunityByName,
            'findCommunityById': findCommunityById,
            'updateCommunity': updateCommunity,
        };
        return api;

        function createCommunity(community) {
            var url = '/api/community';
            return $http.post(url, community);
        }

        function findAllCommunities() {
            var url = '/api/community';
            return $http.get(url);
        }

        function findCommunityByName(communityName) {
            var url = '/api/community?name=' + communityName;
            return $http.get(url);
        }

        function findCommunityById(communityId) {
            var url = '/api/community/' + communityId;
            return $http.get(url);
        }

        function updateCommunity(communityId, community) {
            var url = '/api/community/' + communityId;
            return $http.put(url, community);
        }
    }
})();
