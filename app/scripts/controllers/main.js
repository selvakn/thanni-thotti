'use strict';

angular.module('thanniThottiApp')
  .controller('MainCtrl', function ($scope, firebaseRef, syncData) {
    $scope.tank1Readings = syncData('readings/tank1', 1);

    syncData('meta/tank1').$on('loaded', function(meta){
      $scope.$watch('tank1Readings', function(){
        var tank1 = $scope.tank1Readings[Object.keys($scope.tank1Readings)[0]];
        angular.extend(tank1, meta);
        tank1.level = tank1.depth - tank1.distance;
        tank1.dateObj = new Date(tank1.timestamp * 1000);
        $scope.tank1 = tank1;
      }, true);
    });

  });
