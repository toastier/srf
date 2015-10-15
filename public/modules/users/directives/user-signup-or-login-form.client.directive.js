(function () {
  'use strict';

  angular
    .module('users')
    .directive('userSignupOrLoginForm', userSignupOrLoginForm);

  function userSignupOrLoginForm() {

    return {
      restrict: 'E',
      templateUrl: 'modules/users/directives/partials/user-signup-or-login-form.client.partial.html',
      scope: {
        user: '='
      },
      controller: UserSignupOrLoginFormController,
      controllerAs: 'directiveVm',
      bindToController: true
    };

    function UserSignupOrLoginFormController($scope, $state, Messages, Users, _ ) {
      var directiveVm = this;
      directiveVm.emailIsUnique = true;
      directiveVm.emailStatusMessage = '';
      directiveVm.passwordStatusMessage = '';
      directiveVm.passwordConfirmStatusMessage = '';
      directiveVm.checkPassword = checkPassword;
      directiveVm.checkPasswordsMatch = checkPasswordsMatch;
      directiveVm.checkPasswordStrength = checkPasswordStrength;
      directiveVm.checkingEmail = false;
      directiveVm.debounceEmail = '';
      directiveVm.options = {};
      directiveVm.passwordIsStrong = false;
      directiveVm.passwordsMatch = false;
      directiveVm.signin = signin;
      directiveVm.signup = signup;

      activate();

      function activate() {

        /**
         * checks to see if the email is unique.  Called only by the $scope.$watch so that we can debounce it
         * @param email
         */
        function checkEmail(email) {
          Users.checkEmail({email: email}).$promise
            .then(function (emailIsUnique) {
              directiveVm.emailIsUnique = emailIsUnique.unique;
              directiveVm.checkingEmail = false;
              if(directiveVm.emailIsUnique && directiveVm.userSignupOrLoginForm.email.$valid) {
                directiveVm.emailStatusMessage = 'Email is OK';
              } else if(!directiveVm.emailIsUnique && directiveVm.userSignupOrLoginForm.email.$valid) {
                directiveVm.emailStatusMessage = 'An account exists with this email address';
              } else if(directiveVm.userSignupOrLoginForm.email.$invalid && directiveVm.userSignupOrLoginForm.email.$dirty) {
                directiveVm.emailStatusMessage = 'Email is invalid';
              } else {
                directiveVm.emailStatusMessage = '';
              }
            })
            .catch(function(err) {
              Messages.addMessage(err.data.message, 'error', 'Error checking email');
              directiveVm.checkingEmail = false;
            });
        }

        $scope.$watch('directiveVm.user.email', _.debounce(function (newVal) {
          directiveVm.debounceEmail = newVal;
          checkEmail(directiveVm.debounceEmail);
        }, 1000));
      }

      function checkPasswordsMatch() {
        directiveVm.passwordsMatch = Users.checkPasswordsMatch(directiveVm.user.password, directiveVm.user.passwordConfirm);
        if (!directiveVm.passwordsMatch) {
          directiveVm.passwordConfirmStatusMessage = 'Passwords do not match';
        } else {
          directiveVm.passwordConfirmStatusMessage = 'Passwords match';
        }
      }

      function checkPasswordStrength() {
        directiveVm.passwordIsStrong = Users.checkPasswordStrength(directiveVm.user.password);
        if (!directiveVm.passwordIsStrong) {
          directiveVm.passwordStatusMessage = 'Password is weak';
        } else {
          directiveVm.passwordStatusMessage = 'Password is OK';
        }
      }

      function checkPassword() {
        checkPasswordsMatch();
        checkPasswordStrength();
      }

      function signin() {
        //@todo sign user in
      }

      function signup() {
        directiveVm.user.username = directiveVm.user.email;
        directiveVm.user.auth.signup(directiveVm.user).$promise
          .then(function(user){
            directiveVm.user._id = user._id;
            directiveVm.user.displayName = user.displayName;
            directiveVm.user.roles = user.roles;
            delete directiveVm.password;
            delete directiveVm.passwordConfirm;
          })
          .catch(function(err) {
            Messages.addMessage(err.data.message, 'error', 'Problem Saving User', 'dev');
          });
        //@todo sign user up
      }
    }
  }
})();

