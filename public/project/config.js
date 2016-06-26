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
            .otherwise({
                redirectTo: '/'
            });
    }
})();
