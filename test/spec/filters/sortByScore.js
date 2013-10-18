'use strict';

describe('Filter: sortByScore', function () {

  // load the filter's module
  beforeEach(module('TickeyApp'));

  // initialize a new instance of the filter before each test
  var sortByScore;
  beforeEach(inject(function ($filter) {
    sortByScore = $filter('sortByScore');
  }));

  it('should return the input prefixed with "sortByScore filter:"', function () {
    var text = 'angularjs';
    expect(sortByScore(text)).toBe('sortByScore filter: ' + text);
  });

});
