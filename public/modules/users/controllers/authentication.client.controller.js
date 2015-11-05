(function () {
  'use strict';
  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);


  function AuthenticationController($scope, $state, _, resolvedAuth, Navigation) {

    var vm = this;
    vm.user = resolvedAuth;

    //If user is signed in then redirect back home
    //if (vm.user._id) {
    //  $state.go('main.home');
    //}

    activate();

    function activate () {
      $scope.$watch('vm.user._id', function (newVal) {
        if (_.isString(newVal)) {
          $state.go('main.home');
        }
      });
    }

    Navigation.viewTitle.set('Login');

  }
})();
