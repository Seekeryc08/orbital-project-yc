var newPostApp = angular.module('newpost', ['ionic']);

newPostApp.run(function($ionicPlatform) {
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

function onDeviceReady() {
            alert("hi");
}


function onload() {
  document.addEventListener("deviceready", onDeviceReady, false);

}









/* IF I COMMENT MY MAP CONTROLLER FUNCTION OUT, THE SUBMIT EVENT WORKS (http://localhost:8100/org/newpost.html?title=woo&skills=&address=&latlng=&datetime=&type=Volunteer&description=&deadline=&application=Yes)
                                              , BUT DATA DOES NOT GET STORED IN ANY DATABASE.

*/
newPostApp.controller('MapController', function($scope) {


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
			  map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

			};

			function onError(error) {
				alert('code: '    + error.code    + '\n' +
					  'message: ' + error.message + '\n');
			}

			//UNABLE TO GET USER'S LOCATION ON DEVICE
			var options = {maximumAge: 0, timeout: 10000, enableHighAccuracy:true};
			navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

			function addMarker(location, map) {
			// Add the marker at the clicked location
			// Reference https://developers.google.com/maps/documentation/javascript/markers#add
				var marker = new google.maps.Marker({
					position: location,
					animation: google.maps.Animation.DROP,
					map: map
				});
			}

			// This event listener calls addMarker() when the map is clicked.
			google.maps.event.addListener(map, 'click', function (event) {
				addMarker(event.latLng, map);
				//Convert marker into address
				//https://developers.google.com/maps/documentation/javascript/geocoding#quotas
				//alert("" + event.formatted_address + "");
				document.getElementById('postingForm').latlng.value = event.latLng;
			});
			//posting.location = event.latLng;
			// I need to get event.latLng into my database

		});


});







/*
    newPostApp.controller('myForm', ['$scope', function($scope) {
      $scope.checkboxModel = {
        value1 : 'Q1',
        value2 : 'Q2',
        value2 : 'Q3'
      };
    }]);
*/


/* IF I PUT THIS ABOVE, MY MAP DISAPPEARS

      if(postings) {

        document.getElementById("test_1").innerHTML = "changed";
        document.getElementById('postingForm').addEventListener('submit', addPost);
        //NOTE: ON CLICK, HIDE FORM, SHOW NOTICE THAT POST HAS BEEN ADDED AND PROVIDE A BUTTON TO TAKE THEM BACK TO HOME PG

      }
*/


//ERROR: console says showOrHideOptions() is NOT DEFINED
/*
      function showOrHideOptions() {
        if(document.getElementById("application").selectedIndex == "1") {
          //alert("hey");
          document.getElementById("optionalApplication").style.display = "block";
        } else if(document.getElementById("application").selectedIndex == "0"){
          document.getElementById("optionalApplication").style.display = "none";
        }
      }
*/

