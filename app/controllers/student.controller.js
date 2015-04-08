(function(){
	var app = angular.module('App.Student.Controller', []);

	app.controller('StudentHomepageController', ['$scope', 'authorized', 'UserUniversity', '$q', 'UniversityRso', 'UserEvent', function($scope, authorized, UserUniversity, $q, UniversityRso, UserEvent) {
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

			// Do all loads here!
			var get_university = function() {
				var deferred = $q.defer();
				UserUniversity.get(function(response) {
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
					// console.log(response);
					if(response.status == 200) {
						$scope.member_rsos = response.data;
						$scope.rso.name = response.data[0];
					}
					else
						$scope.member_rsos = false;
				});

				UserEvent.get(function(response) {
					// console.log(response);
					if(response.status == 200)
						$scope.events = response.data;
				});

			}, function(failure) {
				console.log('how do you not have a university?!');
			});
		}
	}]);

	app.directive('availableRsos', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/student/availableRsos.html',
			controller: function($scope, UserRso) {

				$scope.join = function(joinrso) {
					var rso = {
						rsoid: joinrso.name.id
					};
					UserRso.save(rso, function(response) {
						// console.log(response);
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
			controller: function($scope) {

				$scope.view = function(rso) {
					
				};
			}
		};
	}]);

	app.directive('rsorequest', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/student/rsorequest.html',
			controller: function($scope) {
				$scope.rsop = {};
				$scope.rsop.type = 'club';
			}
		};
	}]);


})();