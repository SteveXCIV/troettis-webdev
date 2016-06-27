(function() {
    angular
        .module('Project')
        .factory('SubscriptionService', SubscriptionService);

    function SubscriptionService($http) {
        var api = {
            'createSubscription':       createSubscription,
            'findSubscription':         findSubscription,
            'findSubscriptionsForUser': findSubscriptionsForUser,
            'deleteSubscription':       deleteSubscription,
        };
        return api;

        function createSubscription(userId, communityId) {
            var url = '/api/subscribe/' + userId + '/' + communityId;
            return $http.post(url);
        }

        function findSubscription(userId, communityId) {
            var url = '/api/subscription/get/' + userId + '/' + communityId;
            return $http.get(url);
        }

        function findSubscriptionsForUser(userId) {
            var url = '/api/subscription/user/' + userId;
            return $http.get(url)
        }

        function deleteSubscription(userId, communityId) {
            var url = '/api/unsubscribe/' + userId + '/' + communityId;
            return $http.delete(url);
        }
    }
})();
