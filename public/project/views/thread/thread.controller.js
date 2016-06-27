(function() {
    angular
        .module('Project')
        .controller('ThreadViewController', ThreadViewController)
        .controller('ThreadReplyController', ThreadReplyController)
        .controller('ThreadCreateController', ThreadCreateController);

    function ThreadViewController($http, $routeParams, CommentService, ThreadService) {
        var communityName = $routeParams['communityName'];
        var threadId = $routeParams['threadId'];
        var vm = this;
        vm.currentUser = null;
        vm.thread = null;
        vm.comments = [];
        vm.threadId = threadId;

        function init() {
            vm.alert = null;

            $http
                .get('/api/loggedin')
                .success(
                    function (user) {
                        if (user !== '0') {
                            vm.currentUser = user;
                        }
                    });

            ThreadService
                .findThreadById(threadId)
                .then(
                    function (response) {
                        vm.thread = response.data;
                        return CommentService.findCommentByThread(threadId);
                    })
                .then(
                    function (response) {
                        vm.comments = response.data;
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }
        init();
    }

    function ThreadReplyController($http, $location, $routeParams, CommentService) {
        var communityName = $routeParams['communityName'];
        var threadId = $routeParams['threadId'];
        var vm = this;
        vm.currentUser = null;
        vm.createComment = createComment;

        function init() {
            vm.alert = null;

            $http
                .get('/api/loggedin')
                .success(
                    function (user) {
                        if (user !== '0') {
                            vm.currentUser = user;
                        }
                    });
        }
        init();

        function createComment(element, comment) {
            if (element.$invalid) {
                return;
            }

            CommentService
                .createComment(threadId, comment)
                .then(
                    function (response) {
                        var comment = response.data;
                        $location.url('/c/' + comment.thread.community.name + '/thread/' + comment.thread._id);
                    },
                    function (error) {
                        vm.alert = error;
                    });
        }
    }

    function ThreadCreateController($location, $routeParams, $window, ThreadService) {
        var communityId = $routeParams['communityId'];
        var vm = this;
        vm.back = () => $window.history.back();
        vm.createThread = createThread;

        function createThread(element, thread) {
            if (element.$invalid) {
                return;
            }

            vm.alert = null;

            ThreadService
                .createThread(communityId, thread)
                .then(
                    function (response) {
                        var thread = response.data;
                        $location.url('/c/' + thread.community.name + '/thread/' + thread._id);
                    },
                    function (error) {
                        vm.alert = error.data;
                    });
        }
    }
})();
