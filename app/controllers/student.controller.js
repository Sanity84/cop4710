(function(){
	var app = angular.module('App.Student.Controller', []);

	app.controller('StudentHomepageController', ['$scope', 'authorized', 'UserUniversity', '$q', function($scope, authorized, UserUniversity, $q) {
		if(authorized) {
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
				console.log('everything ok!');
			}, function(failure) {
				console.log('how do you not have a university?!');
			});
		}
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

	app.directive('availableRsos', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/student/availableRsos.html',
			controller: function($scope) {
				$scope.rso = {};
				$scope.rso.name = 'dummy';
			}
		};
	}]);
})();