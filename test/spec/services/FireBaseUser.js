'use strict';

describe('Service: FireBaseUser', function () {

  // load the service's module
  beforeEach(module('TickeyApp'));

  // instantiate service
  var FireBaseUser;
  beforeEach(inject(function (_FireBaseUser_) {
    FireBaseUser = _FireBaseUser_;
  }));

  it('should do something', function () {
    expect(!!FireBaseUser).toBe(true);
  });

});
