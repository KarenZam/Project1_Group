'use strict';

angular.module('TickeyApp')
.controller('howToCtrl', function ($scope, $rootScope) {
    $rootScope.is_how_to_page = true;
    $rootScope.is_game_board_page_small_button = false;
    $rootScope.is_home_page = false;
  
  });