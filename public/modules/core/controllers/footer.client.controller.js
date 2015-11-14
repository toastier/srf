(function () {
  'use strict';
  angular
    .module('core')
    .controller('FooterController', FooterController);

  function FooterController($state, appInfo, resolvedAuth) {

    var footer = this;
    footer.user = resolvedAuth;
    footer.appInfo = appInfo.init();
    footer.signin = signin;

    function signin() {
      $state.go('main.signin');
    }
  }
})();
