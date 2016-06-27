(function() {
    angular
        .module('Project')
        .config(Config);

    function Config($routeProvider) {
        var checkLoggedIn = function (
            $q,
            $timeout,
            $http,
            $location,
            $rootScope) {
            var deferred = $q.defer();
            $http
                .get('/api/loggedin')
                .success(
                    function (user) {
                        $rootScope.errorMessage = null;
                        if (user !== '0') {
                            $rootScope.currentUser = user;
                            deferred.resolve();
                        } else {
                            console.log('Redirecting non-logged-in user to home.');
                            $rootScope.errorMessage = 'You need to be logged in to do that.';
                            deferred.reject();
                            $location.url('/');
                        }
                    });
            return deferred.promise;
        };

        $routeProvider
            .when('/', {
                templateUrl: 'views/home/home.view.client.html',
                controller: 'HomeController',
                controllerAs: 'model',
            })
            .when('/subscriptions', {
                templateUrl: 'views/home/subscriptions.view.client.html',
                controller: 'SubscriptionController',
                controllerAs: 'model',
                resolve: { loggedIn: checkLoggedIn },
            })
            .when('/login', {
                templateUrl: 'views/user/login.view.client.html',
                controller: 'LoginController',
                controllerAs: 'model',
            })
            .when('/register', {
                templateUrl: 'views/user/register.view.client.html',
                controller: 'RegisterController',
                controllerAs: 'model',
            })
            .when('/u/:username', {
                templateUrl: 'views/user/profile.view.client.html',
                controller: 'ProfileController',
                controllerAs: 'model',
            })
            .when('/profile/edit', {
                templateUrl: 'views/user/profile.view.edit.client.html',
                controller: 'ProfileEditController',
                controllerAs: 'model',
                resolve: { loggedIn: checkLoggedIn },
            })
            .when('/community/explore', {
                templateUrl: 'views/community/community-explore.view.client.html',
                controller: 'CommunityExploreController',
                controllerAs: 'model',
            })
            .when('/community/create', {
                templateUrl: 'views/community/community-create.view.client.html',
                controller: 'CommunityCreateController',
                controllerAs: 'model',
                resolve: { loggedIn: checkLoggedIn },
            })
            .when('/community/:communityId/edit', {
                templateUrl: 'views/community/community-edit.view.client.html',
                controller: 'CommunityEditController',
                controllerAs: 'model',
                resolve: { loggedIn: checkLoggedIn },
            })
            .when('/community/:communityId/thread/new', {
                templateUrl: 'views/thread/thread-create.view.client.html',
                controller: 'ThreadCreateController',
                controllerAs: 'model',
                resolve: { loggedIn: checkLoggedIn },
            })
            .when('/community/:communityId/thread/:threadId/reply', {
                templateUrl: 'views/thread/thread-reply.view.client.html',
                controller: 'ThreadReplyController',
                controllerAs: 'model',
                resolve: { loggedIn: checkLoggedIn },
            })
            .when('/c/:communityName', {
                templateUrl: 'views/community/community.view.client.html',
                controller: 'CommunityViewController',
                controllerAs: 'model',
            })
            .when('/c/:communityName/thread/:threadId', {
                templateUrl: 'views/thread/thread.view.client.html',
                controller: 'ThreadViewController',
                controllerAs: 'model',
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();
