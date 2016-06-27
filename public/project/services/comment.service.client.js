(function() {
    angular
        .module('Project')
        .factory('CommentService', CommentService);

    function CommentService($http) {
        var api = {
            'createComment': createComment,
            'findCommentByThread': findCommentByThread,
            'updateComment': updateComment,
        };
        return api;

        function createComment(threadId, comment) {
            var url = '/api/thread/' + threadId + '/comment';
            return $http.post(url, comment);
        }

        function findCommentByThread(threadId) {
            var url = '/api/thread/' + threadId + '/comment';
            return $http.get(url);
        }

        function updateComment(commentId, comment) {
            var url = '/api/comment/' + commentId;
            return $http.put(url, comment);
        }
    }
})();
