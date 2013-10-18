'use strict';

angular.module('TickeyApp')
  .filter('sortByScore', function () {
    return function (input) {
      return 'sortByScore filter: ' + input;
    };
  });
