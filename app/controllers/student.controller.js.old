(function(){
	var app = angular.module('App.Student.Controller', []);

	app.controller('StudentHomepageController', ['$scope', 'authorized', 'User', '$q', 'UniversityRso', 'EventComment', '$modal', function($scope, authorized, User, $q, UniversityRso, EventComment, $modal) {
		if(authorized) {
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
			$scope.map = false;

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
						// console.log('NO!');
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
					if(response.status == 200) {
						$scope.events = response.data;
						var i, marker, infoWindow, content;
						content = function(infoWindow, marker, event) {
							infoWindow.setContent('<h4>' + marker.title + '</h4><p>' +  event.name + '</p>');
							infoWindow.open($scope.map, marker);
						};

						// Load up markers for google map!
						for(i = 0; i < $scope.events.length; i++) {
							$scope.events[i].marker = new google.maps.Marker({
								position: new google.maps.LatLng($scope.events[i].location_lat, $scope.events[i].location_lng),
								title: $scope.events[i].location_name,
								map: $scope.map
							});

							infoWindow = new google.maps.InfoWindow();
					    	google.maps.event.addListener($scope.events[i].marker, 'click', content(infoWindow, $scope.events[i].marker, $scope.events[i]));
						}
					}
				});

			}, function(failure) {
				console.log('how do you not have a university?!');
			});
		}

		$scope.openCreateRso = function() {
			var modalInstance = $modal.open({
				// size: 'lg',
				templateUrl: 'partials/student/rsorequest.html',
				controller: function($scope, $modalInstance, university) {
					$scope.university = university;
					$scope.rsop = {};
					$scope.rsop.type = 'club';

					$scope.close = function() {
						$modalInstance.close();
					};

					$scope.rsoCreate = function(rsop) {
						rsop.email_domain = $scope.university.email_domain;
						// console.log(rsop);
						UniversityRso.save({universityid: $scope.university.id}, rsop, function(response) {
							if(response.status == 200) {
								$scope.rsoRequestError = false;
								$scope.rsop = {};
								$scope.rsop.type = 'club';
								$scope.$parent.rsoSuccess = response.data.message;
								$modalInstance.close();
							}else{
								$scope.rsoRequestError = response.data.message;
							}
						});
					};
				},
				resolve: {
					university: function() {
						return $scope.university;
					}
				}
			});
		};
	}]);

	app.directive('availableRsos', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/student/availableRsos.html',
			controller: function($scope, User) {

				$scope.join = function(joinrso) {
					var rso = {
						rsoid: joinrso.name.id
					};
					User.rso.save(rso, function(response) {
						console.log(response);
						if(status == 200) {
							$scope.joinErrorMessage = false;
						}else{
							$scope.joinErrorMessage = response.data.message;
						}
					});
				};

				$scope.closeErrorMessage = function() {
					$scope.joinErrorMessage = false;
				};
			}
		};
	}]);

	app.directive('studentRsos', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/student/studentRsos.html',
			controller: function($scope, filterFilter) {
				
			}
		};
	}]);

	app.directive('googleMap', function() {
		return {
			restrict: 'A', // attribute
			controller: function($scope) {
				// Generate the map
				var mapOptions = {
			        zoom: 15,
			        center: new google.maps.LatLng(28.602432, -81.200264),
			        mapTypeId: google.maps.MapTypeId.ROADMAP
			    };

			    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
			}
		};
	});

})();


















