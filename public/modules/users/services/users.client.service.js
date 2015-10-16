(function () {
  'use strict';
  angular
    .module('users')
    .factory('Users', User)
    .factory('Roles', Role);
  // User service used for communicating with the users REST endpoint
  function User($resource) {
    var user = $resource('users', {}, {
      update: {
        method: 'PUT'
      },
      checkEmail: {
        method: 'POST',
        url: '/users/checkEmail'
      }
    });

    var modelMethods = {
      checkPasswordsMatch: function (password, passwordConfirm) {
        return password === passwordConfirm;
      },
      checkPasswordStrength: function (password) {
        //@todo implement a password strength strategy
        return (password && angular.isString(password) && password.length > 6);
      }
    };

    var itemMethods = {};

    angular.extend(user, modelMethods);
    angular.extend(user.prototype, itemMethods);

    return user;
  }

  function Role($resource) {

    var role = $resource('roles', {}, {
      update: {
        method: 'PUT'
      }
    });

    return role;
  }
})();
