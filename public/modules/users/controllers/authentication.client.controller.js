angular
  .module('users')
  .controller('AuthenticationController', AuthenticationController);


function AuthenticationController ($location, Authentication, Navigation) {

    var vm = this;

    vm.authentication = Authentication.init();

    //If user is signed in then redirect back home
    if (vm.authentication) $location.path('/');

    Navigation.viewTitle.set('Login Required');

}