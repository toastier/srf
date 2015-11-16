describe('ApplicationsController', function() {
  var controller;

  beforeEach(function() {
    bard.inject('$controller', '$log', '$q', '$rootScope');
  });

  beforeEach(function() {
    controller = $controller('ApplicationsController');
    $rootScope.$apply();
  });

  bard.verifyNoOutstandingHttpRequests();

  describe('ApplicationsController', function () {
    it('should be created successfully', function () {
      expect(controller).to.be.defined;
    });
  });
});
