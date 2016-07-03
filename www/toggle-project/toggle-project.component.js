'use strict';

// Register `toggleProject` component, along with its associated controller and template
angular.
  module('toggleProject').
  component('toggleProject', {
    templateUrl: 'toggle-project/toggle-project.template.html',
    controller: function toggleProject() {
		$ionicSideMenuDelegate.toggleLeft();
    }
  });
