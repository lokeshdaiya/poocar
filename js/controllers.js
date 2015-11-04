angular.module('poocar.controllers', ["ionic", "ngAutocomplete", "ngCordova", "ionic.utils"])
	.factory('AuthenticationService',
	['Base64', '$http', '$rootScope','$localstorage',
	function (Base64, $http, $rootScope, $localstorage) {
	    var serviceBase = 'http://loksa.uphero.com/services/';//$rootScope.baseurl;//'http://192.168.100.4/MobileApps/Ionic/Poocar/www/services/';
	    var service = {};

	    service.Login = function (user, callback) {

	        /* Use this for real authentication
			 ----------------------------------------------*/
	        $http.post(serviceBase + 'login', user)
				.success(function (response) {
				    console.log(response);
				    callback(response);
				});

	    };

	    service.SetCredentials = function (email,userid,name) {
	        //var authdata = Base64.encode(email + ':' + password);
			var globals = {
	            currentUser: {
	                email: email,
	                //authdata: authdata,
					name:name,
					userid:userid
	            }
	        };
	        $localstorage.setObject("user",globals);
	        $rootScope.globals = globals; 

	        //$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
	        //$cookieStore.put('globals', $rootScope.globals);
	    };

	    service.ClearCredentials = function () {
	        $rootScope.globals = {};
	        // $cookieStore.remove('globals');
	        $http.defaults.headers.common.Authorization = 'Basic ';
	    };

	    return service;
	}])

.factory('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
					keyStr.charAt(enc1) +
					keyStr.charAt(enc2) +
					keyStr.charAt(enc3) +
					keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
					"Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
					"Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

    /* jshint ignore:end */
})


.service("UserService", function ($http,$rootScope) {
    var serviceBase = 'http://loksa.uphero.com/services/';//$rootScope.baseurl;
    this.getUsers = function (callback) {
        $http.get(serviceBase + 'users')
		.success(function (response) {
		    callback(response);
		});
        
    };
    this.getUser = function (UserID, callback) {
        $http.get(serviceBase + 'user?id=' + UserID)
		.success(function (response) {
		    callback(response);
		});
    };
    this.insertUser = function (user, callback) {
        $http.post(serviceBase + 'insertUser', user)
		.success(function (response) {
		    callback(response);
		});
    };
    this.updateUser = function (UserDetails, callback) {
        //console.log(UserDetails);
        $http.post(serviceBase + 'updateUserDetails', UserDetails)
        .success(function (response) {
            console.log(response);
            callback(response);
        });
    };
})

.service("RideService", function ($http, UserService,$rootScope) {
    var serviceBase = 'http://loksa.uphero.com/services/';//$rootScope.baseurl;
    this.insertRide = function (ride, callback) {
        $http.post(serviceBase + 'insertRide', ride)
		.success(function (response) {
		    callback(response);
		});
    };

    this.getRides = function (callback) {
        $http.get(serviceBase + 'Rides')
			.success(function (response) {
			    callback(response);
			});
    };

    this.getRide = function (rideid, callback) {
        $http.get(serviceBase + 'Ride?id=' + rideid)
			.success(function (response) {
			    callback(response);
			});
    };
})


.service("LocalNotification", function ($rootScope, $cordovaLocalNotification) {
    this.addNotification = function (text) {
        alert(text);
        var now = new Date();
        var _60_seconds_from_now = new Date(now + 60 * 1000);
        var event = {
            id: 1,
            at: _60_seconds_from_now,
            title: "PooCar",
            text: text
        };

        document.addEventListener("deviceready", function () {
            $cordovaLocalNotification.schedule(event).then(function () {
                console.log("local add : success");
            });

        }, false);

    };

    document.addEventListener("deviceready", function () {
        $rootScope.$on("$cordovaLocalNotification:trigger", function (event, notification, state) {
            console.log("notification id:" + notification.id + " state: " + state);
        });
    }, false);
})

.controller('LoginController', function ($scope, $rootScope, $location, AuthenticationService,$ionicLoading) {
    // reset login status
    //AuthenticationService.ClearCredentials();
    $scope.loginData = "";
    var loginData = this.loginData;
    $scope.login = function (loginData) {
        console.log(loginData);
        $scope.dataLoading = true;
		/*  $ionicLoading.show({
		template: 'Loading...'
		}); */
        AuthenticationService.Login(loginData, function (response) {
            if (response.status == "success") {
				$ionicLoading.hide();
                AuthenticationService.SetCredentials(response.data.email,response.data.userid,response.data.name);
                $location.path('/');
            } else {
                alert("Oops.. did you check your email and password??try again");
                console.log($scope.error);
                // $ionicLoading.hide();
            }
        });
    };
})

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $rootScope,$localstorage,$state) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };
	$scope.logout=function(){
		$localstorage.setObject('user','');
		$rootScope.globals={};
		$state.go("app.Login");
	}

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('SearchCtrl', function ($scope, $stateParams) {
    function initialize(id) {
        // Create the autocomplete object, restricting the search
        // to geographical location types.
        var InputId = new google.maps.places.Autocomplete(
			/* @type {HTMLInputElement} */(document.getElementById(id)),
			{ types: ['geocode'] });
        return InputId;
    }

    //init
    //google.maps.event.addDomListener(window, 'load', initialize());
    $scope.geolocate = function ($event) {
        console.log($event.target.id);
        var inputid = initialize($event.target.id);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var geolocation = new google.maps.LatLng(
					position.coords.latitude, position.coords.longitude);
                var circle = new google.maps.Circle({
                    center: geolocation,
                    radius: position.coords.accuracy
                });
                inputid.setBounds(circle.getBounds());
            });
        }
    }
})

.controller('SignUpCtrl', function ($scope, $rootScope, $location, UserService, $state) {

    var user = this.user;
    $scope.saveUser = function (user) {
        UserService.insertUser(user, function (response) {
            if (response.status == "Success") {
                alert("Registered Successfully");
                $state.go("app.Home", {}, { reload: true });
                $scope.user = null;
                //$scope.user = { name: "", email: "" };
            } else {
                alert("Oops something went wrrong please try again");
                $state.go("app.Signup", {}, { reload: true });
            }
        });
    };


})

.controller('PostRideCtrl', function ($scope, $location, RideService, $state, LocalNotification, $rootScope, $cordovaLocalNotification,$timeout) {
    var ride = this.ride;
	$scope.ride = {NumberofSeats:5};
    
    var timeoutId = null;
    
    $scope.$watch('ride.NumberofSeats', function() {
        
        
        console.log('Has changed');
        
        if(timeoutId !== null) {
            console.log('Ignoring this movement');
            return;
        }
        
        console.log('Not going to ignore this one');
        timeoutId = $timeout( function() {
            
            console.log('It changed recently!');
            
            $timeout.cancel(timeoutId);
            timeoutId = null;
            
            // Now load data from server 
        }, 1000); 
        
        
    });
    $scope.disableTap = function ($event) {
        container = document.getElementsByClassName('pac-container');
        // disable ionic data tab
        angular.element(container).attr('data-tap-disabled', 'true');
        // leave input field if google-address-entry is selected
        angular.element(container).on("click", function () {
            document.getElementById($event.target.id).blur();
        });
    };
    $scope.options = {
        types: ['(cities)'],
        componentRestrictions: { country: 'IN' }
    };
    /*
		$scope.initialize = function (inputid) {
	
		   var id = new google.maps.places.Autocomplete(
			   (document.getElementById(inputid)),
			   { types: ['geocode'] });
	
		   google.maps.event.addListener(id, 'place_changed');
		   return id;
		}
	
		$scope.geolocate = function ($event) {
		   //console.log($event.target.id);
		   id = $scope.initialize($event.target.id);
		   //console.log(id);
		   if (navigator.geolocation) {
			   navigator.geolocation.getCurrentPosition(function (position) {
				   var geolocation = new google.maps.LatLng(
					   position.coords.latitude, position.coords.longitude);
				   var circle = new google.maps.Circle({
					   center: geolocation,
					   radius: position.coords.accuracy
				   });
				   id.setBounds(circle.getBounds());
			   });
		   }
		   else {
			   alert("geo not found");
		   }
		};
	*/

    $scope.saveRide = function (ride) {
        ride.userid = 42;
        //console.log(ride);
        RideService.insertRide(ride, function (RideResponse) {
            if (RideResponse.status == "Success") {
                alert("Your Ride Posted Successfully");
                var message = $scope.CreateNotificationMessage("User", ride.Destination, ride.Origin, ride.Timeofjourney, ride.DateofJourney);
                alert(message);
                //LocalNotification.addNotification(message);
                $scope.addLocalNotification(message);
                $state.go("app.Rides", {}, { reload: true });
            } else {
                alert("Oops something went wrong please try again");
                $scope.ride = null;
                $state.go("app.PostRide", {}, { reload: true });
            }
        });
    };

    $scope.CreateNotificationMessage = function (Name, Destination, Origin, Timeofjourney, DateofJourney) {
        var message = Name + " is going from " + Origin + " to " + Destination + " on date " + DateofJourney + " at " + Timeofjourney;
        return message
    }

    $scope.addLocalNotification = function (text) {
        var now = new Date();
        var _60_seconds_from_now = new Date(now + 60 * 1000);
        var event = {
            id: 1,
            at: _60_seconds_from_now,
            title: "PooCar",
            text: text
        };

        document.addEventListener("deviceready", function () {
            $cordovaLocalNotification.schedule(event).then(function () {
                console.log("local add : success");
            });

        }, false);

    };

    document.addEventListener("deviceready", function () {
        $rootScope.$on("$cordovaLocalNotification:trigger", function (event, notification, state) {
            console.log("notification id:" + notification.id + " state: " + state);
        });
    }, false);

})

.controller('RidesCtrl', function ($scope, $window, $location, RideService, $state, UserService, $stateParams,$rootScope) {
    RideService.getRides(function (response) {
        $scope.rides = response;
		console.log($scope.rides);
    });

})

.controller('RideDetailsCtrl', function ($scope, $location, RideService, $state, $stateParams) {
    RideService.getRide($stateParams.id, function (Response) {
        $scope.RideDetails = Response;
    });

    // RideService.getRide($stateParams.id,function (RideResponse) {
    // UserService.getUser(RideResponse.userid,function(UserResponse){
    // angular.extend(RideResponse,UserResponse);
    // $scope.RideDetails=RideResponse;
    //console.log(UserResponse);
    // });
    //console.log($scope.RideDetails);

    // });
})

.controller("HomeCtrl", function ($scope, $rootScope, $cordovaLocalNotification) {
    $scope.addNotification = function () {
        var now = new Date();
        var _60_seconds_from_now = new Date(now + 60 * 1000);
        var event = {
            id: 1,
            at: _60_seconds_from_now,
            title: "Test Event",
            text: "this is a message about the event"
        };

        document.addEventListener("deviceready", function () {
            $cordovaLocalNotification.schedule(event).then(function () {
                console.log("local add : success");
            });

        }, false);

    };

    $scope.add = function () {
        var alarmTime = new Date();
        alarmTime.setMinutes(alarmTime.getMinutes() + 1);
        $cordovaLocalNotification.add({
            id: "1234",
            date: alarmTime,
            message: "This is a message",
            title: "This is a title",
            autoCancel: true,
            sound: null
        }).then(function () {
            console.log("The notification has been set");
        });
    };

    document.addEventListener("deviceready", function () {
        $rootScope.$on("$cordovaLocalNotification:trigger", function (event, notification, state) {
            console.log("notification id:" + notification.id + " state: " + state);
        });
    }, false);

    $scope.isScheduled = function () {
        $cordovaLocalNotification.isScheduled("1234").then(function (isScheduled) {
            alert("Notification 1234 Scheduled: " + isScheduled);
        });
    }
    $scope.$on("$cordovaLocalNotification:added", function (id, state, json) {
        alert("Added a notification");
    });
})

.controller("UserCtrl", function ($scope, UserService, $state, $stateParams,$rootScope) {
    var user = this.user;
	var userid=$rootScope.globals.currentUser.userid;
    UserService.getUser(userid, function (response) {
        $scope.UserDetails = response;
        //console.log(response);
    });
    
	$scope.UpdateUserDetails = function (UserDetails) {
        UserDetails.userid = $rootScope.globals.currentUser.userid;
        //console.log(UserDetails);

        UserService.updateUser(UserDetails, function (response) {
            if (response.status == "Success") {
                alert("Details Updated Successfully");
                $state.go("app.Home", {}, { reload: true });
            } else {
                alert("Oops something went wrong please try again");
                $state.go("app.UserDetails", {}, { reload: true });
            }
            });
    };
})

.controller("SliderCtrl", function($scope, $ionicSlideBoxDelegate) {
    $scope.navSlide = function(index) {
        $ionicSlideBoxDelegate.slide(index, 500);
    }
})
/*
.controller("NotCtrl",function($scope, $rootScope, $cordovaLocalNotification){
	$scope.add = function() {
		var alarmTime = new Date();
		alarmTime.setMinutes(alarmTime.getMinutes() + 1);
		$cordovaLocalNotification.add({
			id: "1234",
			date: alarmTime,
			message: "This is a message",
			title: "This is a title",
			autoCancel: true,
			sound: null
		}).then(function () {
			console.log("The notification has been set");
		});
	};
 
	$scope.isScheduled = function() {
		$cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
			alert("Notification 1234 Scheduled: " + isScheduled);
		});
	}
	$scope.$on("$cordovaLocalNotification:added", function(id, state, json) {
	alert("Added a notification");
	});	
})
*/


;




