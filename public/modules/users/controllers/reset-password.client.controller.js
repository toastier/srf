(function () {
  'use strict';
  angular
    .module('users')
    .controller('ResetPasswordController', ResetPasswordController);

  function ResetPasswordController($state, $stateParams, resolvedAuth, Users, Messages, Navigation) {

    var vm = this;
    vm.user = resolvedAuth;
    vm.tokenValid = null;
    vm.resetPassword = resetPassword;
    vm.checkPassword = checkPassword;
    vm.checkPasswordConfirm = checkPasswordConfirm;

    activate();

    function activate() {
      vm.user.auth.validateToken({token: $stateParams.token}).$promise
        .then(function(response) {
          if (response.tokenStatus === 'valid') {
            vm.tokenValid = true;
          }
        })
        .catch(function (err) {
          vm.tokenValid = false;
          Messages.addMessage(err.data.message, 'error');
        });
      Navigation.viewTitle.set('Reset Password');
    }

    function checkPasswordConfirm() {
      vm.passwordsMatch = Users.checkPasswordsMatch(vm.user.password, vm.user.passwordConfirm);
      if (!vm.passwordsMatch) {
        return 'Passwords do not match';
      } else {
        return 'Passwords match';
      }
    }

    function checkPassword() {
      vm.passwordIsStrong = Users.checkPasswordStrength(vm.user.password);
      if (!vm.passwordIsStrong) {
        return 'Password is weak';
      } else {
        return 'Password is OK';
      }
    }

    function updateUser(user) {
      vm.user._id = user._id;
      vm.user.honorific = user.honorific;
      vm.user.firstName = user.firstName;
      vm.user.middleName = user.middleName;
      vm.user.lastName = user.lastName;
      vm.user.displayName = user.displayName;
      vm.user.roles = user.roles;
      delete vm.password;
      delete vm.passwordConfirm;
    }

    function resetPassword() {
      vm.user.auth.resetPassword({
        token: $stateParams.token,
        password: vm.user.password
      }).$promise
        .then(function(result) {
          if(result.resetStatus === 'valid' && result.user && angular.isObject(result.user)) {
            updateUser(result.user);
            Messages.addMessage('Your password has been successfully reset.');
            if(result.state && result.state.name && result.state !== 'main.signin') {
              var stateParams = result.stateParams || {};
              $state.go(result.state.name, stateParams);
            } else {
              $state.go('main.home');
            }
          }
        })
        .catch(function (err) {
          Messages.addMessage(err.data.message, 'error');
        });
    }
  }
})();
