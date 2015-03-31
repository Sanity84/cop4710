(function(){
	var app = angular.module('cnt4710', ['ngRoute', 'cnt4710.services', 'cnt4710.controllers']);

	app.config(['$routeProvider', function($routeProvider) {

		// Routing routes
		$routeProvider.when('/university',{
			templateUrl: 'partials/university.html',
			controller: 'UniversityController'
		}).when('/rso',{
			templateUrl: 'partials/rso.html',
			controller: 'RsoController'
		}).when('/event',{
			templateUrl: 'partials/event.html',
			controller: 'EventController'
		}).when('/adminHomepage',{
			templateUrl: 'partials/adminHomepage.html',
			controller: 'AdminHomepageController',
			restrict: ['admin'],
		}).when('/studentHomepage',{
			templateUrl: 'partials/studentHomepage.html',
			controller: 'StudentHomepageController',
			restrict: ['student']
		}).otherwise({
			redirectTo: '/university'
		});

	}]);

	app.run(['$rootScope', '$location', '$sessionStorage', function($rootScope, $location, $sessionStorage) {
		console.log($sessionStorage.role);
		// This is used for restricting certain parts of the website, with the proper role users can access certain webpages
		$rootScope.$on('$routeChangeStart', function(event, next) {
			var role = $sessionStorage.role;
			if(next.restrict)
				if (!role)
					$location.url('/university');
				else if(next.restrict.indexOf(role) < 0)
					event.preventDefault();
		});
	}]);
})();