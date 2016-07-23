var myMain = angular.module('starter', ['ionic']);
var y=1;

myMain.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})



function onload() {
  document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
  //alert("hi");
}


/* The Cordova Geolocation Plugin API is based on the W3C Geolocation API Specification, and only executes on devices that don't already provide an implementation.
https://www.npmjs.com/package/cordova-plugin-geolocation
*/

//Can't get inside function myApp.controller('MapController', function($scope, $cordovaGeolocation){
myMain.controller('MapController', function($scope) {

  /* http://www.joshmorony.com/integrating-google-maps-with-an-ionic-application/

  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
  }, function(error){
      alert("Could not get location");
  });
  */


    //what is dom listener load
    google.maps.event.addDomListener(window, 'load', function() {

        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        $scope.map = map;
        //ALL WORKING FINE UP TILL HERE

        //GET USER's LOCATION
        var onSuccess = function(position) {
/*
          alert('Latitude: '+ position.coords.latitude + '\n'
              + 'Longitude: '+ position.coords.longitude);
*/
              //geolocation working on my browser but NOT ON MY DEVICE; lat/lng is wrong!
              //what is displaying is the custom location that I set for my iOS simulator, not my current location
              //similarly, on android simulator, what is displaying is the location I ran geo fix, not my current location

          map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
          var myLocation = new google.maps.Marker({
              position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
              map: map,
              title: "My Location"
          });

        };

        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }

        //UNABLE TO GET USER'S LOCATION ON DEVICE
        var options = {maximumAge: 0, timeout: 10000, enableHighAccuracy:true};
        navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
        /*http://www.tutorialspoint.com/android/android_emulator.htm*/
        /*http://stackoverflow.com/questions/16262878/phonegap-geolocation-code-3-timeout-expired-keeps-popping-up-on-some-android*/
        //http://stackoverflow.com/questions/4169061/android-emulator-having-issues-with-geolocation

        google.maps.event.addListenerOnce($scope.map, 'idle', function(){

          var marker = new google.maps.Marker({
              map: $scope.map,
              animation: google.maps.Animation.DROP,
              position: myLatlng //this will get the location before geolocation kicks in
          });

          var infoWindow = new google.maps.InfoWindow({
              content: "Here I am!"
          });

          //THIS CODE ONLY ALLOWS ONE INFOWINDOW TO POP UP
          // This event listener calls addMarker() when the map is clicked.
          google.maps.event.addListener(marker, 'click', function () {
            //addMarker(event.latLng, map);

            infoWindow.open($scope.map, marker);

            //posting.location = event.latLng;
          });
          // I need to get event.latLng into my database

        });

    });


});


  function addMarker(location, map) {
    // Add the marker at the clicked location
    // Reference https://developers.google.com/maps/documentation/javascript/markers#add
    var marker = new google.maps.Marker({
      position: location,
      animation: google.maps.Animation.DROP,
      map: map
    });
  }





myMain.controller('refresher', function($scope, $http) {
  $scope.doRefresh = function() {
    $http.get('/new-items')
     .success(function(newItems) {
       //$scope.items = newItems;
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
});

myMain.controller('toggleMenu', function($scope, $ionicSideMenuDelegate) {

  $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

})



//TRYING TO DO ROUTING FOR MAIN.HTML
myMain.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('main', {
            url: '/main', //TO CHECK WHETHER THIS IS CORRECT
            templateUrl: 'posts.html',
            resolve: {
              posts: ['posts', function (posts) {
                return posts.all();
              }]
            },
            controller: 'TestMainController' //I NEED VALUES HERE THAT ARE MAYBE... FROM MY DATABASE,
                                            //TO BE DISPLAYED IN MY TEMPLATE
        })

        .state('main.post-detail', {
            url: "/:postId", //represents a parameter that will be passed into our controller
            templateUrl: "post-detail.html",

            //on how to use resolve, https://github.com/angular-ui/ui-router/wiki#resolve
            resolve: {
                docdetail: function($stateParams) {
                    var doc = $stateParams.postId;

                    return dbpostings.get(doc).then(function (resp) {
                        alert(resp.title);
                        return resp;
                    }).catch(function (err) {
                      console.log(err);
                    });
                }
            },

            //get the document that has the clicked id, and I want to display all details of only
            //that doc
            controller: function ($scope, docdetail) {
                $scope.docdetail = docdetail;
            }

        });

    $urlRouterProvider.otherwise('/main');
});



myMain.factory('posts', ['$http', function($http) {
  var path = 'http://localhost:5984/postings/_all_docs?limit=20&include_docs=true';

  var posts = $http.get(path).then(function(response) {
      document.getElementById('OppListUl').innerHTML = "NO errors entering into $http.get()";
      return response.data.rows; //or response.data.rows
  });

  var factory = {};

  factory.all = function() {
    return posts;
  };

  return factory;
}]);


myMain.controller("TestMainController", ['$scope', 'posts', function($scope, posts) {

    $scope.posts = posts;

}]);


