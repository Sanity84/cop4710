(function(){
	var app = angular.module('App.Controller', ['App.Services']);

	app.controller('AppController', ['$rootScope', '$scope', 'SessionAPI', 'Session', '$location', function($rootScope, $scope, SessionAPI, Session, $location) {
		$rootScope.loggedin = null;
		$rootScope.firstname = null;
		$rootScope.homepage = null;
		$scope.logout = function() {
			SessionAPI.remove({}, function(data) {
				Session.destroy();
				$rootScope.loggedin = false;
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
			controller: function($rootScope, $scope, User, Session, $location) {
				$scope.login = function(loginUser) {
					User.resource(loginUser.username, loginUser.password).login({}, function(data) {
						if(data.status == 200) {
							Session.destroy(); // Clear out any old data
							$rootScope.loggedin = true;
							Session.create(data.data);
							$scope.loginUser = {};
							$scope.firstname = Session.firstname;
							$scope.errorMessage = false;
							// Redirect user to respective page
							switch(Session.role) {
								case 'admin': $rootScope.homepage = 'adminHomepage'; $location.url('/adminHomepage'); break;
								case 'leader': $rootScope.homepage = 'leaderHomepage'; $location.url('/leaderHomepage'); break;
								case 'student': $rootScope.homepage = 'studentHomepage'; $location.url('/studentHomepage'); break;
								default: $location.url('/events'); break;
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
			controller: function($rootScope, $scope, User, Session, $location, University) {
				University.query(function(response) {
					$scope.universities = response;
					$scope.register.school = $scope.universities[0];
				});

				$scope.create = function(user) {
					var school = $scope.register.school;
					// Database API only accepts 'email' Set depending on role
					var studentemail = user.studentemail;
					var adminemail = user.adminemail;
					user.email = (user.role == 'student') ? user.studentemail += user.school.email_domain : user.adminemail;
					user.universityid = user.school.id; // API expects universityid
					// When submitting this role is VERY important, if admin no school is auto associated, if a student a school is auto associated
					User.resource().save(user, function(response) {
						if(response.status == 200) {
							// Log in newly created user!
							Session.create(response.data);
							$rootScope.loggedin = true;
							$rootScope.firstname = response.data.firstname;
							// Reset form to make it look pretty
							$scope.register = {};
							$scope.register.role = 'student';
							$scope.register.school = school;
							$scope.errorMessage = false;
							switch(Session.role) {
								case 'admin': $rootScope.homepage = 'adminHomepage'; $location.url('/adminHomepage'); break;
								case 'leader': $rootScope.homepage = 'leaderHomepage'; $location.url('/leaderHomepage'); break;
								case 'student': $rootScope.homepage = 'studentHomepage'; $location.url('/studentHomepage'); break;
								default: $location.url('/events'); break;
							}
						}else{
							$scope.errorMessage = response.data.message;
							$scope.register.studentemail = studentemail;
							$scope.register.adminemail = adminemail;
							$scope.register.email = null;
							// TODO: Do fix here for email addresses for student creation? 
						}
					});
				};
			}
		};
	}]);

	app.controller('ListUsersController', ['$scope', 'GetAllUsers', 'authorized', function($scope, GetAllUsers, authorized) {
		if(authorized) {
			
		}
		GetAllUsers.get(function(response) {
			// will always success because I said so!
			$scope.admins = response.data.admins;
			$scope.leaders = response.data.leaders;
			$scope.students = response.data.students;
		});
	}]);

})();