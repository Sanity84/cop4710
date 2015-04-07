(function(){
	var app = angular.module('App.Leader.Controller', ['ui.tinymce']);

	app.controller('LeaderHomepageController', ['$scope', 'authorized', function($scope, authorized) {
		$scope.authorized = false;
		if(authorized) {
			// Do all loads here!
			$scope.authorized = true; // Used to cascade into directives
		}
	}]);

	app.directive('leaderCreateEvent', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/leader/createEvent.html',
			controller: function($scope, Event) {

				// Check that user is logged in and verified
				if($scope.authorized) {
					$scope.event = {};
					// Types to populate select
					$scope.types = [
						{
							type: 'Social',
							value: 'social'

						},
						{
							type: 'Fundraising',
							value: 'fundraising'
						},
						{
							type: 'Tech Talk',
							value: 'techtalk'
						}
					];
					$scope.visibilities = [
						{
							visibility: 'Public',
							value: 'public',
						},
						{
							visibility: 'RSO Members Only',
							value: 'rso'
						},
						{
							visibility: 'University Students Only',
							value: 'student'
						}
					];
					$scope.event.type = $scope.types[0];
					$scope.event.visibility = $scope.visibilities[0];

					// For date NOTE: this could be useful for our bootstrap.ui dropdown, to stop auto closing on document click
					$scope.open = function($event) {
						$event.preventDefault();
						$event.stopPropagation();
						$scope.opened = true;
					};
					$scope.event.date = Date.now();
					$scope.event.time = new Date().getTime();

					$scope.create = function(event) {
						var insert = event;
						var original_date = event.date;
						var date = new Date(event.date);
						var time = new Date(event.time);
						var datetime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
						insert.date = datetime;
						insert.type = event.type.type;
						insert.visibility = event.visibility.visibility;

						// NOTE don't care that time is still around, database doesn't use it
						Event.save(insert, function(response) {
							console.log(response);
						});

						// Do save here and response

						// reset ALWAYS back to default values
					};

				}
			}
		};
	}]);
})();