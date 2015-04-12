(function() {
	var app = angular.module('App.Events.Controller', []);

	app.controller('EventsController', ['$scope', 'Event', 'University', 'authorized', function($scope, Event, University, authorized) {
		if(authorized) {
			// Do login require loads here!
		}
		$scope.filterUniversity = {};
		$scope.filteredEvents = [];
		// $scope.filter = {};
		$scope.events = [];

		University.query(function(response) {
			// console.log(response);
			$scope.universities = response;
			// $scope.filter.university = $scope.universities[0];
			$scope.filterUniversity = $scope.universities[0];
		});
		
		Event.query(function(response) {
			$scope.events = response;
		});

		// // create marker
		// var addMarker = function(event) {
		// 	var lat = event.location_lat, lng = event.location_lng;
		// 	// will return marker
		// 	var marker = new google.maps.Marker({
		// 		position: new google.maps.LatLng(lat,lng),
		// 		title: event.location_name
		// 	});

		// 	var infoWindow = new google.maps.InfoWindow();
	 //    	google.maps.event.addListener(marker, 'click', function(){
	 //            infoWindow.setContent('<h4>' + marker.title + '</h4><p>' +  event.name + '</p>');
	 //            infoWindow.open($scope.map, marker);
  //       	});
  //       	// Need to simulate click when someone clicks on location name and bring them to top of map
	 //    	return marker;
		// };

		// $scope.$watchCollection('filteredEvents', function(new_events, old_events) {
		// 	// Deal with markers here! erase all old markers and create new ones on the map, also center around university
		// 	$scope.markers = [];
		// 	$scope.filteredEvents.marker = null;
		// 	var i, length = $scope.filteredEvents.length;
		// 	for(i = 0; i < length; i++) {
				
		// 		$scope.markers.push(addMarker($scope.filteredEvents[i]));
		// 		// rebind back to filteredEvents! allows fancy stuff
		// 		$scope.filteredEvents[i].marker = $scope.markers[i];
		// 		$scope.markers[i].setMap($scope.map);
		// 	}
		// });
		// Test watch, seems to work fine!
		// $scope.moo = [{'cow' : 'moo'}];

		// $scope.$watchCollection('moo', function(newValue, oldValue) {
		// 	console.log(newValue);
		// 	console.log(oldValue);
		// });

		// $scope.clickme = function() {
		// 	$scope.moo = [{'cow': 'mooOoOOO!'}];
		// };
	}]);

	app.directive('googleMaps', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/events/googleMaps.html',
			controller: function($scope, $location, $anchorScroll) {

				$scope.markers = [];
				$scope.filteredEvents = [];

				// create marker
				var addMarker = function(event) {
					var lat = event.location_lat, lng = event.location_lng;
					// will return marker
					var marker = new google.maps.Marker({
						position: new google.maps.LatLng(lat,lng),
						title: event.location_name
					});

					var infoWindow = new google.maps.InfoWindow();
			    	google.maps.event.addListener(marker, 'click', function(){
			            infoWindow.setContent('<h4>' + marker.title + '</h4><p>' +  event.name + '</p>');
			            infoWindow.open($scope.map, marker);
		        	});
		        	// Need to simulate click when someone clicks on location name and bring them to top of map
			    	return marker;
				};

				$scope.$watchCollection('filteredEvents', function(new_events, old_events) {
					// Deal with markers here! erase all old markers and create new ones on the map, also center around university
					var i, length = $scope.markers.length;
					for(i = 0; i < length; i++)
						$scope.markers[i].setMap(null);
					$scope.markers = [];

					// change map center here!
					// $scope.filteredEvents.marker = null;
					length = $scope.filteredEvents.length;
					for(i = 0; i < length; i++) {
						
						$scope.markers.push(addMarker($scope.filteredEvents[i]));
						// rebind back to filteredEvents! allows fancy stuff
						$scope.filteredEvents[i].marker = $scope.markers[i];
						$scope.markers[i].setMap($scope.map);
					}
				});

				// $scope.addMarkers = function() {
					
				//     var i, length = $scope.filteredEvents.length;
				//     for(i = 0; i < length; i++) {
				//     	// console.log($scope.events[i]);
				//     	$scope.markers.push(addMarker($scope.filteredEvents[i]));
				//     	// rebind back to filteredEvents! allows fancy stuff
				//     	$scope.filteredEvents[i].marker = $scope.markers[i];
				//     	$scope.markers[i].setMap($scope.map);
				//     }
				//     // console.log($scope.markers);
				// };
				// both still used!
				$scope.removeMarkers = function() {
					// google.maps.event.clearListeners($scope.map, 'bounds_changed'); // doesn't work, bleh
					// console.log('removing...');
				    var i, length = $scope.markers.length;
				    for(i = 0; i < length; i++)
				    	$scope.markers[i].setMap(null);
				    $scope.markers = [];
				};

				// Make event location clickable to focus on map
				$scope.openInfoWindow = function(marker) {
					google.maps.event.trigger(marker, 'click');
					$location.hash('map');
					$anchorScroll();
				};

				navigator.geolocation.getCurrentPosition(function(position) {
					// LOCATION SPOOFING TODO: REMOVE IN FINAL!!!
					// var local_lat = position.coords.latitude,
					// local_lng = position.coords.longitude;
					// console.log('lat: ' + local_lat + ' :long ' + local_lng);
					// 28.602432, -81.200264
					var local_lat = 28.602432,
					local_lng = -81.200264;

					// Do google map initialization here
					var mapOptions = {
				        zoom: 15,
				        center: new google.maps.LatLng(local_lat, local_lng),
				        mapTypeId: google.maps.MapTypeId.ROADMAP
				    };

				    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

				    // call here! to populate map at first!
				    var i, length = $scope.filteredEvents.length;
				    for(i = 0; i < length; i++) {
				    	// console.log($scope.events[i]);
				    	$scope.markers.push(addMarker($scope.filteredEvents[i]));
				    	// rebind back to filteredEvents! allows fancy stuff
				    	$scope.filteredEvents[i].marker = $scope.markers[i];
				    	$scope.markers[i].setMap($scope.map);
				    }
				});
			}
		};
	}]);
})();