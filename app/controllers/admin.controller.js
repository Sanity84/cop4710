(function(){
	var app = angular.module('App.Admin.Controller', []);

	app.controller('AdminHomepageController', ['$scope', 'authorized', '$location', 'User', 'Rso', '$modal', function($scope, authorized, $location, User, Rso, $modal) {
		if(!authorized)
			return $location.url('/events');
		$scope.noProfile = true; // Keeps track if a profile has been created
		$scope.university = {};
		$scope.rsorequests = [];

		$scope.university = User.university.get(function (response) {
			if (response.status == 200) {
				$scope.noProfile = false;
				$scope.university = response.data.university;
				var images = response.data.images;
				// Retrieve rso requests
				Rso.query(function (response) {
					$scope.rsorequests = response;
				});
				// Retrieve events for university
				$scope.slides = [];
				for(var i = 0; i < images.length; i++) {
					$scope.slides.push(images[i]);
				}
			}
		});

		// TODO: complete, also maybe fix bug with close / open window removing mce editor?
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
	}]);;
	
	// Completed
	app.directive('rsorequests', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/admin/rsorequests.html',
			controller: function($scope, Rso) {
				$scope.rsorequestMessage = false;
				$scope.accept = function(rso) {
					var rsoIndex = $scope.rsorequests.indexOf(rso);
					var update = {};
					update.id = rso.id;
					update.update = 'accept';
					update.leaderid = rso.leaderid; // promote student to leader
					Rso.update(update, function(response) {
						$scope.rsorequestMessage = response.data.message;
						if(response.status == 200) {
							// splice array and show success message
							$scope.rsorequests.splice(rso, 1);
						}
					});
				};

				$scope.reject = function(rso) {
					var rsoIndex = $scope.rsorequests.indexOf(rso);
					var update = {};
					update.id = rso.id;
					update.update = 'reject';
					// simply delete the request
					Rso.update(update, function(response) {
						$scope.rsorequestMessage = response.data.message;
						if(response.status == 200) {
							// splice array and show success message
							$scope.rsorequests.splice(rso, 1);
						}
					});
				};
			}
		};
	});

	app.directive('addimage', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/admin/addimage.html',
			controller: ["University", "$scope", function(University, $scope) {
				$scope.create = function() {
					var image = {};
					image.name = this.name;
					image.url = this.url;
					image.universityid = $scope.university.id;
					//TODO add callbacks
					University.image.save(image).$promise.then(function(response) {
					}, function (response) {
					});
				};
			}]
		};
	});

	// Completed
	app.directive('createProfile', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/admin/createProfile.html',
			controller: function($scope, University) {
				$scope.errorMessage_createprofile = false;

				$scope.createProfile = function(school) {
					University.resource.save(school, function(response) {
						if(response.status == 200) {
							$scope.noProfile = false;
							$scope.university = response.data;
							$scope.errorMessage_createprofile = false;
						}else{
							$scope.errorMessage_createprofile = response.data.message;
						}
					});
				};
			}
		};
	});

})();