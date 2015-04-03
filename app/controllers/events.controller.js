(function() {
	var app = angular.module('App.Events.Controller', []);

	app.controller('EventsController', ['$scope', 'UCFPublicEvents', 'University', function($scope, UCFPublicEvents, University) {
		$scope.filter = {};
		University.query(function(response) {
			console.log(response);
			$scope.universities = response;
			$scope.filter.university = $scope.universities[0];
		});

		UCFPublicEvents.query(function(response) {
			$scope.events = response;
		});
	}]);
})();