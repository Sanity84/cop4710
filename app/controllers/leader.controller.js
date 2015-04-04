(function(){
	var app = angular.module('App.Leader.Controller', []);

	app.controller('LeaderHomepageController', ['$scope', 'authorized', function($scope, authorized) {
		if(authorized) {
			// Do all loads here!
		}
	}]);
})();