'use strict';

angular
  .module('thanniThottiApp', ['angularfire.firebase', 'angularMoment'])
  .filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    };
  })
  .filter('inFeet', function() {
    return function(input) {
      var feet = input / 30.0;
      var feetComponent = parseInt(feet);
      var inchComponent = ((feet - feetComponent) * 12).toFixed(0);

      return feetComponent + '\' '+ inchComponent + '"';
    };
  });
