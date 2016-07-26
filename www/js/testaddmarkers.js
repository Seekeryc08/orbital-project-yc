var myApp = angular.module('starter', ['ionic']);
var y=1;

myApp.run(function($ionicPlatform) { //, GoogleMaps
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
    //GoogleMaps.init();
  });
})


function onload() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {}


//FETCHING AND DISPLAYING MARKERS FROM MY DATABASE
myApp.factory('Markers', function ($http) {
  var markers = [];

  return {
    getMarkers: function(){
      return $http.get("http://localhost:5984/postings/_all_docs?limit=20&include_docs=true").then(function(response){
          markers = response.data.rows;
          return markers;
      });
    }
  }
});


myApp.controller('MapCtrl', function($scope, Markers) {

    google.maps.event.addDomListener(window, 'load', function() {

        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        $scope.map = map;

        //GET USER's LOCATION
        var onSuccess = function(position) {

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

        var options = {maximumAge: 0, timeout: 10000, enableHighAccuracy:true};
        navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

        google.maps.event.addListenerOnce($scope.map, 'idle', function(){
			//Load the markers
			loadMarkers();

        });


		function loadMarkers(){
			//Get all of the markers from our Markers factory
			Markers.getMarkers().then(function(markers){

				var records = markers;

				for (var i = 0; i < records.length; i++) {

					var record = records[i];
					var markerPos = new google.maps.LatLng(record.doc.lat, record.doc.lng);

					function addMarker(location, map) {

						// Add the marker to the map
						var marker = new google.maps.Marker({
							map: map,
							animation: google.maps.Animation.DROP,
							position: location
						});
					}

					addMarker(markerPos, map);
					//var infoWindowContent = "<h4>" + record.name + "</h4>";
					//addInfoWindow(marker, infoWindowContent, record);
				}
			});
		}
/*
		function addInfoWindow(marker, message, record) {

		  var infoWindow = new google.maps.InfoWindow({
			  content: message
		  });

		  google.maps.event.addListener(marker, 'click', function () {
			  infoWindow.open(map, marker);
		  });

		}
*/
    });


});
