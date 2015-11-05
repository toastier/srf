(function () {
  'use strict';
  angular
    .module('core')
    .controller('FooterController', FooterController);

    function FooterController (appInfo, resolvedAuth) {
      var footer = this;
      footer.user = resolvedAuth;
      footer.appInfo = appInfo.init();
    }
})();
