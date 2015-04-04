(function(){
	var app = angular.module('App.Student.Controller', []);

	app.controller('StudentHomepageController', ['$scope', 'authorized', function($scope, authorized) {
		if(authorized) {
			// Do all loads here!
		}
	}]);
})();