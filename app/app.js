(function(){
	var app = angular.module('App', ['ngRoute', 'App.Services', 'App.Controller', 'App.Events.Controller', 'App.Admin.Controller', 'App.Leader.Controller', 'App.Student.Controller']);

	app.config(['$routeProvider', function($routeProvider) {

		// Routing routes
		$routeProvider.when('/events',{
			templateUrl: 'partials/events/events.html',
			controller: 'EventsController'
		}).when('/adminHomepage',{
			templateUrl: 'partials/admin/homepage.html',
			controller: 'AdminHomepageController'
		}).when('/leaderHomepage', {
			templateUrl: 'partials/leader/homepage.html',
			controller: 'LeaderHomepageController'
		}).when('/studentHomepage',{
			templateUrl: 'partials/student/homepage.html',
			controller: 'StudentHomepageController'
		}).otherwise({
			redirectTo: '/events'
		});

	}]);

	app.run(['$rootScope', '$location', '$sessionStorage', function($rootScope, $location, $sessionStorage) {
		// console.log($sessionStorage.role);
		// // This is used for restricting certain parts of the website, with the proper role users can access certain webpages
		// $rootScope.$on('$routeChangeStart', function(event, next) {
		// 	var role = $sessionStorage.role;
		// 	if(next.restrict)
		// 		if (!role)
		// 			$location.url('/university');
		// 		else if(next.restrict.indexOf(role) < 0)
		// 			event.preventDefault();
		// });
	}]);
})();