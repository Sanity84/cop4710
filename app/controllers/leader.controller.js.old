(function(){
	var app = angular.module('App.Leader.Controller', ['ui.tinymce']);

	app.controller('LeaderHomepageController', ['$scope', 'authorized', '$modal', 'User', '$q', 'UniversityRso', 'EventComment', '$location',
		function($scope, authorized, $modal, User, $q, UniversityRso, EventComment, $location) {
		if(!authorized)
			$location.url('/events');
		// if(authorized) {
			// initialize
			$scope.university = {};
			$scope.available_rsos = [];
			$scope.member_rsos = [];
			$scope.joinrso = {};
			$scope.rso = {};
			$scope.joinErrorMessage = false;
			$scope.viewRsoEvents = [];
			$scope.events = [];
			$scope.ratings = [
				{ value:1, display: '1 star'},
				{ value:2, display: '2 star'},
				{ value:3, display: '3 star'},
				{ value:4, display: '4 star'},
				{ value:5, display: '5 star'}
			];
			$scope.comment = {};
			$scope.comment.rating = $scope.ratings[4];

			$scope.addComment = function(comment, event) {
				comment.rating = comment.rating.value;
				comment.eventid = event.id;
				EventComment.save({eventid: event.id}, comment, function(response) {
					console.log(response);
					if(response.status == 200) {
						$scope.comment = {};
						$scope.comment.rating = $scope.ratings[4];
						event.comments.push(response.data);
					}else{
						$scope.comment.rating = $scope.ratings[4];
					}
				});
			};

			$scope.deleteComment = function(comment, event) {
				var indexOfComment = event.comments.indexOf(comment);
				EventComment.remove({eventid: event.id}, function(response) {
					if(response.status == 200) {
						// splice event array where this id did exist!
						event.comments.splice(indexOfComment, 1);
					}
				});
			};

			// Do all loads here!
			var get_university = function() {
				var deferred = $q.defer();
				User.university.get(function(response) {
					if(response.status == 200) {
						$scope.university = response.data.university;
						deferred.resolve();
					}else {
						deferred.reject();
					}
				});
				return deferred.promise;
			};

			var promise = get_university();
			promise.then(function(success) {
				// Get all rsos this school has to offer
				UniversityRso.get({universityid: $scope.university.id}, function(response) {
					// console.log(response.data);
					if(response.status == 200) {
						$scope.available_rsos = response.data;
						$scope.joinrso.name = $scope.available_rsos[0];
					}
				});

				// Get all rsos that this student is a member of
				UniversityRso.get({universityid: $scope.university.id, member: true}, function(response) {
					if(response.status == 200) {
						$scope.member_rsos = response.data;
						// do some fancy manipulatoin to get desired results
						angular.forEach($scope.member_rsos, function(value, key) {
						  value.filter = value.name;
						});
						$scope.member_rsos.unshift({name: 'All Events', filter: '', description: 'All Events and RSOs you are a member of'});
						$scope.rso.name = response.data[0];
						// console.log($scope.member_rsos);
					}
					else
						$scope.member_rsos = false;
				});

				User.event.get(function(response) {
					// console.log(response);
					if(response.status == 200)
						$scope.events = response.data;
				});
			}, function(failure) {
				console.log('how do you not have a university?!');
			});
		// }

		$scope.openCreateEvent = function() {
			var modalInstance = $modal.open({
				size: 'lg',
				templateUrl: 'partials/leader/createEvent.html',
				controller: function($scope, $modalInstance, Event) {
					$scope.event = {};
					// Types to populate select
					//TODO(wil) should we add these to db?
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
							value: 'public'
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
					// Used for fancy ui.bootstrap widgets
					$scope.open = function($event) {
						$event.preventDefault();
						$event.stopPropagation();
						$scope.opened = true;
					};
					$scope.event.date = Date.now();
					$scope.event.time = new Date().getTime();
					
					// close modal window after completion
					$scope.close = function() {
						$modalInstance.close();
					};

					$scope.create = function(rsop) {
						// Fix type and visibility
						var insert = rsop;
						insert.visibility = rsop.visibility.value;
						insert.type = rsop.type.value;
						Event.save(rsop, function(response) {
							console.log(response);
							if(response.status == 200) {
								$scope.event = {};
								$scope.event.type = $scope.types[0];
								$scope.event.visibility = $scope.visibilities[0];
								$scope.createEventError = false;
								$scope.$parent.createEventSuccess = response.data.message;
								$modalInstance.close();
							}else{
								$scope.createEventError = response.data.message;
							}
						});
					};
				}
			});
		};
	}]);
})();