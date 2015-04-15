(function(){
	var app = angular.module('App.Student.Controller', []);

	app.controller('StudentHomepageController', ['$scope', 'authorized', 'User', 'UniversityRso', 'EventComment', '$modal', '$location', 'filterFilter', '$window', 
		function($scope, authorized, User, UniversityRso, EventComment, $modal, $location, filterFilter, $window) {
		if(!authorized)
			$location.url('/events');

		$scope.university = {}; // This will NEVER change for the user
		$scope.map = false;
		$scope.events = [];
		$scope.filteredEvents = [];
		$scope.joinrso = {}; // required for old functionlaity
		$scope.rso = {}; // required for old functionality
		$scope.available_rsos = [];
		$scope.member_rsos = [];
		$scope.joinErrorMessage = false;
		// Comment system
		$scope.ratings = [
			{ value:1, display: '1 star'},
			{ value:2, display: '2 star'},
			{ value:3, display: '3 star'},
			{ value:4, display: '4 star'},
			{ value:5, display: '5 star'}
		];
		$scope.comment = {};
		$scope.comment.rating = $scope.ratings[4];

		// Comment system
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
		
		var updateMarkers = function(oldMarkers) {
			var i;

			// remove old markers
			if(oldMarkers) {
				for(i = 0; i < oldMarkers.length; i++) {
					oldMarkers[i].marker.setMap(null);
					oldMarkers[i].marker = false;
				}
			}
			var infoWindow = new google.maps.InfoWindow();

			var new_marker = function(event) {
				event.marker = new google.maps.Marker({
					position: new google.maps.LatLng(event.location_lat, event.location_lng),
					title: event.location_name,
					map: $scope.map
				});

		    	google.maps.event.addListener(event.marker, 'click', function() {
		    		infoWindow.setContent('<h4>' + event.marker.title + '</h4><p>' +  event.name + '</p>');
		    		infoWindow.open($scope.map, event.marker);
		    	});
			};

			// Creating in loop creates bug, try calling a function to auto create all this fun
			for(i = 0; i < $scope.filteredEvents.length; i++)
				new_marker($scope.filteredEvents[i]);

			// go to the first marker
			if($scope.filteredEvents[0])
				google.maps.event.trigger($scope.filteredEvents[0].marker, 'click');
		};

		// Students receieve their events from their association with their university
		User.university.get(function(response) {
			if(response.status == 200) {
				$scope.university = response.data.university;

				// Get ALL available RSOs that the user may join in this university
				UniversityRso.get({universityid: $scope.university.id}, function(response) {
					if(response.status == 200) {
						$scope.available_rsos = response.data;
						$scope.joinrso.name = $scope.available_rsos[0]; // set default as first
					}
				});

				// Also get a list of the RSOs the user is ALREADY a part of
				UniversityRso.get({universityid: $scope.university.id, member: true}, function(response) {
					if(response.status == 200)
						$scope.member_rsos = response.data;

					// Always create an array
					angular.forEach($scope.member_rsos, function(value, key) {
					  value.filter = value.name;
					});

					// Setup default 'filter', this will grab all university and rso events
					$scope.member_rsos.unshift({name: 'All Events', filter: '', description: 'All Events and RSOs you are a member of'});
					$scope.rso.name = response.data[0]; // set deafult
					$scope.filteredEvents = filterFilter($scope.events, {rso: $scope.rso.filter}); // loaded! Active filters!
					updateMarkers();
				});
			}
		});

		// This retrieves ALL events that the user is authorized to view, it will be filtered based on the drop down selector
		User.event.get(function(response) {
			if(response.status == 200)
				$scope.events = response.data;

			// Load up the map!
			var mapOptions = {
		        zoom: 15,
		        center: new google.maps.LatLng(28.602432, -81.200264),
		        mapTypeId: google.maps.MapTypeId.ROADMAP
		    };

			$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
		});

		// This is the drop down selector watch method! events will be updated and filtered here!
		$scope.$watch('rso.name', function(rso) {
			if(rso) { // don't get too excited before data is received
				var oldMarkers = $scope.filteredEvents;
				$scope.filteredEvents = filterFilter($scope.events, {rso: rso.filter});
				updateMarkers(oldMarkers);
			}
		});

		// when clicked on an event location pops up a nifty window
		$scope.openInfoWindow = function(marker){
			$window.scrollTo(0,0);
			google.maps.event.trigger(marker, 'click');
		};

		// Used if a user wants to just view whatever events are near them
		$scope.getLocation = function() {	
			navigator.geolocation.getCurrentPosition(function(position) {
				var local_lat = position.coords.latitude;
				var local_lng = position.coords.longitude;
				var latLng = new google.maps.LatLng(local_lat, local_lng);
				var oldMarkers = $scope.filteredEvents;
				var i;
				$scope.filteredEvents = [];
				$scope.map.setCenter(latLng);

				var check_distance = function(event) {
					// 1000 meters radius of the users location!
					if(2000 > google.maps.geometry.spherical.computeDistanceBetween($scope.map.center, new google.maps.LatLng(event.location_lat, event.location_lng)))
						$scope.filteredEvents.push($scope.events[i]);
				};

				for(i = 0; i < $scope.events.length; i++) {
					check_distance($scope.events[0]);
				}
				updateMarkers(oldMarkers);
				$scope.$apply();
			});
		};

		// Unique to students request to create RSO
		$scope.openCreateRso = function() {
			var modalInstance = $modal.open({
				// size: 'lg',
				templateUrl: 'partials/student/rsorequest.html',
				controller: function($scope, $modalInstance, university) {
					$scope.university = university;
					$scope.rsop = {};  // this is set within the view, oops
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

	// Working fine
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

})();