(function() {
	var app = angular.module('App.Events.Controller', []);

	app.controller('EventsController', ['$scope', 'Event', 'University', 'filterFilter', function($scope, Event, University, filterFilter) {
		$scope.map = false;
		$scope.events = [];
		$scope.filteredEvents = [];
		$scope.filterUniversity = {};

		// Remove and update all markers on map
		var updateMarkers = function(oldMarkers) {
			var i, marker, infoWindow, content;

			// remove old markers
			if(oldMarkers) {
				for(i = 0; i < oldMarkers.length; i++) {
					oldMarkers[i].marker.setMap(null);
					oldMarkers[i].marker = false;
				}
			}

			content = function(infoWindow, marker, event) {
				infoWindow.setContent('<h4>' + marker.title + '</h4><p>' +  event.name + '</p>');
				infoWindow.open($scope.map, marker);
			};

			for(i = 0; i < $scope.filteredEvents.length; i++) {
				$scope.filteredEvents[i].marker = new google.maps.Marker({
					position: new google.maps.LatLng($scope.filteredEvents[i].location_lat, $scope.filteredEvents[i].location_lng),
					title: $scope.filteredEvents[i].location_name,
					map: $scope.map
				});

				infoWindow = new google.maps.InfoWindow();
		    	google.maps.event.addListener($scope.filteredEvents[i].marker, 'click', content(infoWindow, $scope.filteredEvents[i].marker, $scope.filteredEvents[i]));
			}
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
		    University.query(function(response) {
		    	$scope.universities = response;
		    	// filter defaults
		    	$scope.filterUniversity = $scope.universities[0];
		    	$scope.filteredEvents = filterFilter($scope.events, {university: $scope.filterUniversity.name});
		    	updateMarkers();
		    });
		});

		// Callable methods
		$scope.getLocation = function() {
			var oldMarkers = $scope.filteredEvents;
			$scope.filteredEvents = [];
			navigator.geolocation.getCurrentPosition(function(position) {
				var local_lat = position.coords.latitude;
				var local_lng = position.coords.longitude;
				var latLng = new google.maps.LatLng(local_lat, local_lng);
				var i;
				$scope.map.setCenter(latLng);
				for(i = 0; i < $scope.events.length; i++) {
					// console.log(google.maps.geometry.spherical.computeDistanceBetween($scope.map.center, new google.maps.LatLng($scope.events[i].location_lat, $scope.events[i].location_lng)));
					if(500 > google.maps.geometry.spherical.computeDistanceBetween($scope.map.center, new google.maps.LatLng($scope.events[i].location_lat, $scope.events[i].location_lng)))
						$scope.filteredEvents.push($scope.events[i]);
				}
				updateMarkers(oldMarkers);
			});
		};

		$scope.updateFilter = function(university) {
			var oldMarkers = $scope.filteredEvents;
			$scope.filteredEvents = filterFilter($scope.events, {university: university.name});
			updateMarkers(oldMarkers);
		};
	}]);
})();