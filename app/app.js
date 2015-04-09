(function(){
	var app = angular.module('App', ['ngRoute', 'App.Services', 'App.Controller', 'App.Events.Controller', 'App.Admin.Controller', 'App.Leader.Controller', 'App.Student.Controller', 'ui.tinymce', 'ui.bootstrap']);

	app.config(['$routeProvider', function($routeProvider) {

		// Used to preload session data on refreshes and browser window closes
		// NOTE: must resolve to either true or false, reject will block the view from displaying! (not in a good way)
		var authorized = function($rootScope, $q, Session, Cookie, SessionAPI, $location) {
			var deferred = $q.defer();
			if($rootScope.loggedin) {
				// User is already logged in, we don't need to refresh data or anything!
				deferred.resolve(true);

			}else if(Cookie.get('session')) {

				SessionAPI.get(function(response) {
					if(response.status == 200) {
						Session.create(response.data);
						deferred.resolve(true);
						// console.log('Refreshing user data');
					}else{
						console.log('Key no longer valid');
						Session.destroy();
						deferred.resolve(false);
						// $location.url('/events');
					}
				});
			}else{
				console.log('no cookie!');
				deferred.resolve(false);
				// $location.url('/events');
			}
			return deferred.promise;
		};

		// All pages get authorized because we want data on everypage!, if something must be restricted place it
		// in the if(authorized) {} block in the controller
		// Routing routes
		$routeProvider.when('/events',{
			templateUrl: 'partials/events/events.html',
			controller: 'EventsController',
			resolve: {
				authorized: authorized
			}
		}).when('/adminHomepage',{
			templateUrl: 'partials/admin/homepage.html',
			controller: 'AdminHomepageController',
			resolve: {
				authorized: authorized
			}
		}).when('/leaderHomepage', {
			templateUrl: 'partials/leader/homepage.html',
			controller: 'LeaderHomepageController',
			resolve: {
				authorized: authorized
			}
		}).when('/studentHomepage',{
			templateUrl: 'partials/student/homepage.html',
			controller: 'StudentHomepageController',
			resolve: {
				authorized: authorized
			}
		}).when('/listUsers', {
			templateUrl: 'partials/listUsers.html',
			controller: 'ListUsersController',
			resolve: {
				authorized: authorized
			}
		}).otherwise({
			redirectTo: '/events'
		});

	}]);

})();