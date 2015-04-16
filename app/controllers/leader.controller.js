(function(){
	var app = angular.module('App.Leader.Controller', []);

	app.controller('LeaderHomepageController', ['$scope', 'authorized', 'User', 'UniversityRso', 'EventComment', '$modal', '$location', 'filterFilter', '$window', 
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
				var images = response.data.images;
				$scope.slides = [];
				for(var i = 0; i < images.length; i++) {
					$scope.slides.push(images[i]);
				}

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
					$scope.member_rsos.unshift({name: 'University Events', filter: null, description: 'University Events'});
					$scope.member_rsos.unshift({name: 'All Events', filter: '', description: 'All Events and RSOs you are a member of'});
					$scope.rso.name = $scope.member_rsos[0]; // set deafult
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
					// 2000 meters radius of the users location!
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

		// Unique to leader, create a new rso event!
		$scope.openCreateEvent = function() {
			var modalInstance = $modal.open({
				size: 'lg',
				templateUrl: 'partials/leader/createEvent.html',
				controller: function($scope, $modalInstance, Event) {
					$scope.event = {};
					tinymce.remove(); // destroy tinyMCE to recreate it on next render 
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
					// test
					$scope.validation = false;
					$scope.create = function(rsop) {

						// There is probably a better way to do this, but this works for now feel free to fix ryan
						if($scope.createEvent.location.$invalid) {
							$scope.validation = 'Location cannot be empty';
							return;
						}
						else if($scope.createEvent.locationlat.$invalid) {
							$scope.validation = 'Location latitude cannot be empty';
							return;
						}
						else if($scope.createEvent.locationlng.$invalid) {
							$scope.validation = 'Location longitude cannot be empty';
							return;
						}
						else if($scope.createEvent.name.$invalid) {
							$scope.validation = 'Location name cannot be empty';
							return;
						}else if($scope.createEvent.description.$invalid) {
							$scope.validation = 'Event description cannot be empty';
							return;
						}
						else
							$scope.validation = false;
							
						// Fix type and visibility
						var insert = rsop;
						insert.visibility = rsop.visibility.value;
						insert.type = rsop.type.value;
						// time and date must be convereted
						var time = new Date(insert.time);
						var date = new Date(insert.date); 
						// month is derped need to + 1
						date.setUTCMonth(date.getUTCMonth() + 1);

						// manually configure this for mysql insertion
						var mysql_datetime = 
							date.getFullYear() + '-' + 
							((date.getMonth() < 10) ? '0' + date.getMonth() : date.getMonth()) + '-' + 
							((date.getDate() < 10) ? '0' + date.getDate() : date.getDate()) + ' ' +
							((time.getHours() < 10) ? '0' + time.getHours() : time.getHours()) + ':' + 
							((time.getMinutes() < 10) ? '0' + time.getMinutes() : time.getMinutes()) + ':00';

						insert.date = mysql_datetime;
						Event.save(insert, function(response) {
							// console.log(response);
							if(response.status == 200) {
								$scope.event = {};
								$scope.event.type = $scope.types[0];
								$scope.event.visibility = $scope.visibilities[0];
								$scope.createEventError = false;
								$scope.$parent.createEventSuccess = response.data.message;
								$modalInstance.close();
							}else{
								$scope.createEventError = response.data.message;
								// $scope.event.type = $scope.types[0];
								// $scope.event.visibility = $scope.visibilities[0];
							}
						});
					};
				}
			});
		};

	}]);
})();