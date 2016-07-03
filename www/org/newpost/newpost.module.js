(function() {

'use strict';
    angular.module('newpost', ['ionic']).controller('myForm', ['$scope', function($scope) {
		$scope.checkboxModel = {
			value1 : 'Q1',
			value2 : 'Q2',
			value2 : 'Q3'
		};
    }]);


	angular.module('newpost', ['ionic']).controller('MapOrgController', function($scope) {

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
/*
			  var myLocation = new google.maps.Marker({
				  position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
				  map: map,
				  title: "My Location"
			  });
*/
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
				postingForm.latlng.value = event.latLng;
			});
			//posting.location = event.latLng;
			// I need to get event.latLng into my database

		});

	});





})();
