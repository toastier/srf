/**
 * @ngdoc directive
 * @scope vm
 * @example
   <user-signup-or-signin-form user="vm.user"></user-signup-or-signin-form>
 */
(function () {
  'use strict';

  angular
    .module('users')
    .directive('userSignupOrSigninForm', userSignupOrSigninForm);

  function userSignupOrSigninForm() {

    return {
      restrict: 'E',
      templateUrl: 'modules/users/directives/partials/user-signup-or-signin-form.client.partial.html',
      scope: {
        user: '='
      },
      controller: UserSignupOrSigninFormController,
      controllerAs: 'vm',
      bindToController: true
    };

    function UserSignupOrSigninFormController($state, $stateParams, $scope, Messages, Users, _, utility ) {
      var vm = this;
      vm.emailIsUnique = null;
      vm.emailStatusMessage = emailStatusMessage;
      vm.passwordStatusMessage = '';
      vm.passwordConfirmStatusMessage = '';
      vm.checkPassword = checkPassword;
      vm.checkPasswordConfirm = checkPasswordConfirm;
      vm.checkingEmail = false;
      vm.userIsNew = userIsNew;
      vm.debounceEmail = '';
      vm.options = {};
      vm.passwordIsStrong = false;
      vm.passwordsMatch = false;
      vm.signin = signin;
      vm.signup = signup;
      vm.checkEmailDebounced = utility.debounce(checkEmail, 1000, false);
      vm.failedLogin = false;
      vm.forgotPassword = forgotPassword;
      vm.passwordResetLinkSent = false;

      activate();

      function activate() {

        /**
         * watch the user email, and if it is valid, check to see if it is unique, using the checkEmailDebounced method
         */
        $scope.$watch('vm.user.email', function(newVal) {
          if(vm.userForm && vm.userForm.email) {
            if(vm.userForm.email.$valid && vm.userForm.email.$dirty) {
              vm.checkingEmail = true;
              vm.checkEmailDebounced(newVal);
            } else {
              vm.checkingEmail = false;
              vm.emailIsUnique = null;
            }
          }
        });
      }

      /**
       * checks to see if the email is unique.  Called only by the $scope.$watch so that we can debounce it
       * @param email
       */
      function checkEmail(email) {
        if(!vm.userForm.email.$valid) {
          return false;
        }
        Users.checkEmail({email: email}).$promise
          .then(function (result) {
            vm.emailIsUnique = result.unique;
            vm.accountIsShib = !result.local;
            vm.checkingEmail = false;

          })
          .catch(function(err) {
            Messages.addMessage(err.data.message, 'error', 'Error checking email');
            vm.checkingEmail = false;
          });
      }

      function emailStatusMessage() {
        if(vm.checkingEmail) {
          return 'Validating email...';
        } else if (vm.emailIsUnique && vm.userForm.email.$valid) {
          return 'Email is valid';
        } else if (vm.accountIsShib) {
          return 'This email is associated with a Duke NetId. You must login through the Duke NetId System';
        } else if(!vm.emailIsUnique && vm.userForm.email.$valid) {
          return 'An account exists with this email address';
        } else if(vm.userForm.email.$invalid && vm.userForm.email.$dirty) {
          return 'Email is invalid';
        }

        return '';
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

      function forgotPassword() {
        vm.user.auth.forgotPassword({
          user: vm.user,
          resetPasswordState: $state.current,
          resetPasswordStateParams: $stateParams
        }).$promise
          .then(function(response) {
            vm.passwordResetLinkSent = 'A password reset link has been sent to ' + response.email + '.';
            Messages.addMessage(vm.passwordResetLinkSent);
          })
          .catch(function (err) {
            Messages.addMessage(err.data.message, 'error');
          });
      }

      function userIsNew() {
        return vm.userForm.email.$valid && vm.emailIsUnique;
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

      function signin() {
        vm.user.username = vm.user.email;
        vm.user.auth.signin(vm.user).$promise
          .then(function (user) {
            Messages.addMessage('Welcome back ' + user.honorific + ' ' + user.lastName + ', you are now logged in.', 'success', 'Welcome Back');
            updateUser(user);
            if(user.resetPasswordState && user.resetPasswordState.name !== 'main.signin') {
              $state.go(user.resetPasswordState.name, user.resetPasswordStateParams);
            } else if ($state.$current.name === 'main.signin') {
              $state.go('main.home');
            }
          })
          .catch(function (err) {
            Messages.addMessage(err.data.message, 'error', 'Problem Signing in', 'dev');
            vm.failedLogin = true;
          });
        //@todo sign user in
      }

      function signup() {
        vm.user.username = vm.user.email;
        vm.user.auth.signup(vm.user).$promise
          .then(function(user){
            updateUser(user);
          })
          .catch(function(err) {
            Messages.addMessage(err.data.message, 'error', 'Problem Saving User', 'dev');
          });
      }
    }
  }
})();

