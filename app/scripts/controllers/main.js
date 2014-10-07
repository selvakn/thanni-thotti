'use strict';

angular.module('thanniThottiApp')
  .controller('MainCtrl', function ($scope, firebaseRef, syncData) {

    function getColor(value){
      //value from 0 to 1
      var hue=(value*100).toString(10);
      return ['hsl(',hue,',100%,50%)'].join('');
    }

    syncData('readings/tank1', 1).$asObject().$bindTo($scope, 'tank1Readings');

    syncData('meta/tank1').$asObject().$loaded().then(function(meta){
      $scope.$watch('tank1Readings', function(){
        var tank1 = angular.copy($scope.tank1Readings[Object.keys($scope.tank1Readings)[0]]);
        angular.extend(tank1, meta);
        tank1.level = tank1.depth - tank1.distance;
        tank1.dateObj = new Date(tank1.timestamp * 1000);
        tank1.color = getColor(tank1.level / tank1.maxHeight);
        $scope.tank1 = tank1;
      }, true);
    });

    syncData('readings/tank2', 1).$asObject().$bindTo($scope, 'tank2Readings');

    syncData('meta/tank2').$asObject().$loaded().then(function(meta){
      $scope.$watch('tank2Readings', function(){
        var tank2 = angular.copy($scope.tank2Readings[Object.keys($scope.tank2Readings)[0]]);
        angular.extend(tank2, meta);
        tank2.level = tank2.depth - tank2.distance;
        tank2.dateObj = new Date(tank2.timestamp * 1000);
        tank2.color = getColor(tank2.level / tank2.maxHeight);
        $scope.tank2 = tank2;
      }, true);
    });

  });
