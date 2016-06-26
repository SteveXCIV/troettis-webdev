(function() {
    angular
        .module('Project')
        .factory('ThreadService', ThreadService);

    function ThreadService($http) {
        var api = {
            'createThread': createThread,
            'findMostRecentThreads': findMostRecentThreads,
            'findThreadByCommunity': findThreadByCommunity,
            'findThreadById': findThreadById,
            'updateThread': updateThread,
            'deleteThread': deleteThread,
        };
        return api;

        function createThread(thread) {
            var url = '/api/thread';
            return $http.post(url, thread);
        }

        function findMostRecentThreads() {
            var url = '/api/thread/recent';
            return $http.get(url);
        }

        function findThreadByCommunity(communityId) {
            var url = '/api/community/' + communityId + '/thread';
            return $http.get(url);
        }

        function findThreadById(threadId) {
            var url = '/api/thread/' + threadId;
            return $http.get(url);
        }

        function updateThread(threadId, thread) {
            var url = '/api/thread/' + threadId;
            return $http.put(url, thread);
        }

        function deleteThread(threadId) {
            var url = '/api/thread/' + threadId;
            return $http.delete(url);
        }
    }
})();
