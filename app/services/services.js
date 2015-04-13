(function(){
	var app = angular.module('App.Services', ['ngResource', 'base64']);

	app.service('Session', ['$rootScope', 'Cookie', function($rootScope, Cookie) {
		this.create = function(data) {
			// console.log(data);
			$rootScope.loggedin = true;
			$rootScope.firstname = data.firstname;
			$rootScope.isCollapsed = true;
			$rootScope.userid = data.id;
			Cookie.put('session', data.session, null); // Only session as long as user doesn't close browser
			this.session = data.session;
			this.role = data.role;
			this.firstname = data.firstname;
			switch(data.role) {
				case 'admin': $rootScope.homepage = 'adminHomepage'; break;
				case 'leader': $rootScope.homepage = 'leaderHomepage'; break;
				case 'student': $rootScope.homepage = 'studentHomepage'; break;
				default: break;
			}
		};

		this.destroy = function() {
			$rootScope.loggedin = false;
			$rootScope.firstname = false;
			this.session = null;
			this.role = null;
			this.firstname = null;
			Cookie.put('session', '', -1);
		};
	}]);

	app.factory('User', ['$resource', '$base64', function($resource, $base64) {
		return {
			resource: function(username, password) {
				return $resource('api/user', {}, {
					login: {
						method: 'GET',
						headers: {
							'Authorization': 'Basic ' + $base64.encode(username + ':' + password)
						}
					}
				});
			},
			university: $resource('api/user/university'),
			event: $resource('api/user/event'),
			rso: $resource('api/user/rso')
		};
	}]);

	app.factory('SessionAPI', ['$resource', function($resource) {
		return $resource('api/session');
	}]);

	app.factory('University', ['$resource', function($resource) {
		return {
			resource: $resource('api/university/:id'),
			image: $resource('api/university/image')
		};
	}]);

	app.factory('UCFPublicEvents', ['$resource', function($resource) {
		return $resource('http://events.ucf.edu/feed.json');
	}]);

	// Used for helpful creation of RSOs and account information
	app.factory('GetAllUsers', ['$resource', function($resource) {
		return $resource('api/getAllUsers');
	}]);

	app.factory('RsoRequest', ['$resource', function($resource) {
		return $resource('api/rsorequest');
	}]);

	app.factory('Rso', ['$resource', function($resource) {
		return $resource('api/rso');
	}]);

	app.factory('Event', ['$resource', function($resource) {
		return $resource('api/event');
	}]);

	// if member is any value this will retrieve a logged in users rsos that they are a member in, else just the schools rsos
	app.factory('UniversityRso', ['$resource', function($resource) {
		return $resource('api/university/:universityid/rso/:member');
	}]);

	app.factory('EventComment', ['$resource', function($resource) {
		return $resource('api/event/:eventid/comment/:commentid', null, {
			update: { method: 'PUT' }
		});
	}]);

	app.service('Cookie', function() {
		this.put = function (cname, cvalue, exdays) {
			if(exdays !== null) {
				var d = new Date();
				d.setTime(d.getTime() + (exdays*24*60*60*1000));
				var expires = "expires="+d.toUTCString();
				document.cookie = cname + "=" + cvalue + "; " + expires;
			}else{
				// Short session (not remember me)
				document.cookie = cname + "=" + cvalue;
			}
		};

		this.get = function (cname) {
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) === 0) 
					return c.substring(name.length,c.length);
			}
			return "";
		};
	});

	app.filter('unsafe', function($sce) {
		return function(val) {
			return $sce.trustAsHtml(val);
		};
	});
})();