(function() {
	var app = angular.module('App.Events.Controller', []);

	app.controller('EventsController', ['$scope', 'Event', 'University', 'filterFilter', '$window', function($scope, Event, University, filterFilter, $window) {
		$scope.map = false;
		$scope.events = [];
		$scope.filteredEvents = [];
		$scope.filterUniversity = {};

		// Remove and update all markers on map
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

		Event.query(function(response) {
			$scope.events = response;

			// generate map
			var mapOptions = {
		        zoom: 15,
		        center: new google.maps.LatLng(28.602432, -81.200264),
		        mapTypeId: google.maps.MapTypeId.ROADMAP
		    };

		    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

		    // Generate universities
		    University.resource.query(function(response) {
		    	$scope.universities = response;
		    	// filter defaults
		    	$scope.filterUniversity = $scope.universities[0];
		    	$scope.filteredEvents = filterFilter($scope.events, {university: $scope.filterUniversity.name});
		    	updateMarkers();
		    });
		});

		// Callable methods
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

		$scope.$watch('filterUniversity', function(university) {
			var oldMarkers = $scope.filteredEvents;
			$scope.filteredEvents = filterFilter($scope.events, {university: university.name});
			updateMarkers(oldMarkers);
		});

		// button, just using $watch method now
		// $scope.updateFilter = function(university) {
		// 	var oldMarkers = $scope.filteredEvents;
		// 	$scope.filteredEvents = filterFilter($scope.events, {university: university.name});
		// 	updateMarkers(oldMarkers);
		// };

		// used to open info window and scroll to top of page when a link is clicked on
		$scope.openInfoWindow = function(marker){
			$window.scrollTo(0,0);
			google.maps.event.trigger(marker, 'click');
		};
	}]);
})();