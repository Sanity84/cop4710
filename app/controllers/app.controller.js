(function(){
	var app = angular.module('App.Controller', ['App.Services']);

	app.controller('AppController', ['$scope', 'User', 'Session', 'SessionAPI', 'Cookie', '$location', '$sessionStorage', function($scope, User, Session, SessionAPI, Cookie, $location, $sessionStorage) {
		// Enables dynamic homepage button depending on user role
		switch($sessionStorage.role) {
			case 'admin': $scope.homepage = 'adminHomepage'; break;
			case 'student': $scope.homepage = 'studentHomepage'; break;
			default: break;
		}

		$scope.logout = function() {
			SessionAPI.remove({}, function(data) {
				Session.destroy();
				$scope.loggedin = false;
				$location.url('/university');
			});
		};
	}]);

	app.directive('navigation', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/app/navigation.html',
			controller: function() {}
		};
	}]);

	app.directive('login', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/app/login.html',
			controller: function($scope, User, Session, $location) {
				$scope.login = function(loginUser) {
					User.resource(loginUser.username, loginUser.password).login({}, function(data) {
						if(data.status == 200) {
							Session.destroy(); // Clear out any old data
							$scope.loggedin = true;
							Session.create(data.data);
							$scope.loginUser = {};
							$scope.firstname = Session.firstname;
							$scope.errorMessage = false;
							// Redirect user to respective page
							switch(Session.role) {
								case 'admin': $scope.homepage = 'adminHomepage'; $location.url('/adminHomepage'); break;
								case 'leader': $scope.homepage = 'leaderHomepage'; $location.url('/leaderHomepage'); break;
								case 'student': $scope.homepage = 'studentHomepage'; $location.url('/studentHomepage'); break;
								default: $location.url('/university'); break;
							}
						}else{
							$scope.loggedin = false;
							$scope.errorMessage = data.data.message;
						}
					});
				};
			}
		};
	}]);

	app.directive('createAccount', [function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/app/create.html',
			controller: function($scope, User, Session, $location, University) {
				University.query(function(response) {
					$scope.universities = response;
					$scope.register.school = $scope.universities[0];
				});

				$scope.create = function(user) {
					var school = $scope.register.school;
					// Database API only accepts 'email' Set depending on role
					user.email = (user.role == 'student') ? user.studentemail += user.school.email_domain : user.adminemail;
					user.universityid = user.school.id; // API expects universityid
					// When submitting this role is VERY important, if admin no school is auto associated, if a student a school is auto associated
					User.resource().save(user, function(response) {
						if(response.status == 200) {
							// Log in newly created user!
							Session.create(response.data);
							$rootScope.session = response.data;
							$rootScope.loggedin = true;

							// Reset form to make it look pretty
							$scope.register = {};
							$scope.register.role = 'student';
							$scope.register.school = school;
							$scope.$parent.errorMessage = false;
							switch (Session.role) {
								case 'student':
								$location.url('/user/student'); $rootScope.homepage = 'user/student'; break;
								case 'admin':
								$location.url('/user/admin'); $rootScope.homepage = 'user/admin'; break;
								case 'leader':
								$location.url('/user/leader'); $rootScope.homepage = 'user/leader'; break;
								default: break;
							}
						}else{
							$scope.$parent.errorMessage = response.data.message;
							// TODO: Do fix here for email addresses for student creation? 
						}
					});
				};
			}
		};
	}]);

})();