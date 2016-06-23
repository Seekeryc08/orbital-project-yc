var myproject = angular.module('starter', ['ionic']);

/*
//Pouch DB
var dbpostings = new PouchDB('postings');
var remoteCouch = 'http://localhost:5984/dbpostings';
*/

.run(function($ionicPlatform) {
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

myproject.controller('MapController', function($scope) {

    google.maps.event.addDomListener(window, 'load', function() {

        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });

        $scope.map = map;
/*
        // This event listener calls addMarker() when the map is clicked.
        google.maps.event.addListener(map, 'click', function(event) {
          addMarker(event.latLng, map);
          posting.location = event.latLng;
        });
        // I need to get event.latLng into my database
*/
    });

});


/*

function addMarker(location, map) {
  // Add the marker at the clicked location
  // Reference https://developers.google.com/maps/documentation/javascript/markers#add
  var marker = new google.maps.Marker({
    position: location,
    animation: google.maps.Animation.DROP,
    map: map
  });
}

//if Submit button is clicked, run this function to get all data into PouchDB database
function addaPosting() {
  window.alert('Button was clicked!');

  dbpostings.put(posting, function callback(err, result) {
    if (!err) {
      console.log('Success');
    }
  });
}

function syncError() {
}

// Initialise a sync with the remote server
function sync() {
  var opts = {live: true};
  dbpostings.sync(remoteCouch, opts, syncError);
}


if(remoteCouch) {
  document.getElementById("para").innerHTML = "changed";
  sync();
}
*/


/*
var posting = {
_id: new Date().toISOString(),
location: "",
sample: true
//all other data from S.E. form here
};
*/
