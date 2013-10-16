
// app declaration with []
angular.module('LocalStorageModule').value('prefix', 'myDatabaseNewName');

angular.module('TickeyApp',['LocalStorageModule', 'firebase'])
  .config(function ($routeProvider){
      $routeProvider
        .when('/game_board', {
          templateUrl: 'views/game_board.html',
          controller:'GameBoardCtrl'
        })
        .when('/game_board/:id/:mySymbol', {
          templateUrl: 'views/game_board.html',
          controller:'GameBoardCtrl'
        })
        .when('/how_to', {
          templateUrl: 'views/how_to.html',
          controller:'howToCtrl'
        })
        .when('/', {
          templateUrl: 'views/index.html',
          controller:'indexCtrl'
        })
        .when('/MatchPlayer', {
          templateUrl: 'views/MatchPlayer.html',
          controller: 'MatchplayerCtrl'
        })
        .otherwise({
          redirection: '/'
        })
  });




