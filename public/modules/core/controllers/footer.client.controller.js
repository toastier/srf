(function () {
  'use strict';
  angular
    .module('core')
    .controller('FooterController', FooterController);

    function FooterController (Authentication, appInfo) {
      var footer = this;
      footer.appInfo = appInfo.init();

      // Authentication returns a promise.  Wait for it to resolve before setting up the state.
      // @todo convert to use ui-router resolve as we are doing in the main area of the view
      Authentication.promise
        .then(function(result) {
          footer.user = result;
        });
    }
})();
