(function () {
  'use strict';
  angular.module('core').controller('FooterController', ['Authentication', 'appInfo', 'Messages',
    function (Authentication, appInfo) {
      var footer = this;
      Authentication.init();
      footer.authentication = Authentication.init();
      footer.appInfo = appInfo.init();
    }
  ]);
})();
