(function () {
  'use strict';
  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);


  function AuthenticationController($location, Authentication, Navigation) {

    var vm = this;

    vm.user = Authentication;

    //If user is signed in then redirect back home
    if (vm.user) $location.path('/');

    Navigation.viewTitle.set('Login Required');

  }
})();
