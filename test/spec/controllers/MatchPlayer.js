'use strict';

describe('Controller: MatchplayerCtrl', function () {

  // load the controller's module
  beforeEach(module('TickeyApp'));

  var MatchplayerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MatchplayerCtrl = $controller('MatchplayerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
