(function(){
	var app = angular.module('App.Admin.Controller', []);

	app.controller('AdminHomepageController', ['$scope', 'UserUniversity', 'authorized', 'RsoRequest', '$q', function($scope, UserUniversity, authorized, RsoRequest, $q) {
		if(authorized) {
			var deferred = $q.defer();
			// This just notifies the user if they have created a school profile, if not let them create one
			$scope.noProfile = true;
			var get_university = function() {
				UserUniversity.get(function(response) {
					if(response.status == 200) {
						deferred.resolve();
						$scope.noProfile = false;
						// $scope.university = response.data.university;
					}else{
						deferred.reject();
					}
				});
				return deferred.promise;
			};

			var get_rsorequests = function() {
				RsoRequest.get(function(response) {
					// sloppy but easier than rewrite
					if(response.status == 200 && response.data != 'No new requests') {
						console.log(response);
						$scope.rsorequests = response.data;
					}else{
						// Reject something
					}
				});
			};
			// Get rso requests!
			var promise = get_university();
			promise.then(function(success) {
				get_rsorequests();
			}, function(failure) {
				// Nothing gets called because parent failed
			});

			//TODO add this to event module instead
			$scope.openCreateEvent = function() {
				var modalInstance = $modal.open({
					size: 'lg',
					templateUrl: 'partials/leader/createEvent.html',
					controller: function($scope, $modalInstance, Event) {
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
								value: 'public'
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
							// $scope.$parent.createEventSuccess = 'words!';
							// $modalInstance.close();
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
		}
		
	}]);

	app.directive('rsorequests', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/admin/rsorequests.html',
			controller: function($scope, Rso) {
				$scope.accept = function(id) {
					Rso.save({id: id}, function(response) {
						console.log(response);
					});
					console.log('accepted ' + id);
				};
				$scope.reject = function(id) {
					console.log('rejected ' + id);
				};
			}
		};
	}]);

	// TODO: Ensure this is working properly
	app.directive('createProfile', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/admin/createProfile.html',
			controller: function($scope, University) {
				$scope.createProfile = function(school) {
					University.save(school, function(response) {
						if(response.status == 200) {
							$scope.noProfile = false;
							// populate university
							$scope.university = response.data;
							$scope.school = {}; // clear out
							$scope.errorMessage_createprofile = false;
							// show success
						}else{
							// show error message
							$scope.errorMessage_createprofile = response.data.message;
						}
					});
				};
			}
		};
	}]);
})();