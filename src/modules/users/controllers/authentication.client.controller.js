(function () {
  'use strict';
  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);


  function AuthenticationController($scope, $state, _, resolvedAuth, Navigation) {

    var vm = this;
    vm.user = resolvedAuth;

    activate();

    function activate () {
      //$scope.$watch('vm.user._id', function (newVal) {
      //  if (_.isString(newVal)) {
      //    if(!vm.user.resetPasswordState || !vm.user.resetPasswordStateParams) {
      //      $state.go('main.home');
      //    }
      //  }
      //});
      if(vm.user._id) {
        $state.go('main.home');
      }
    }

    Navigation.viewTitle.set('Login');

  }
})();
