(function () {
  'use strict';
  angular
    .module('users')
    .service('Authentication', Authentication);

  function Authentication($state, $resource, $q, _ ) {

    // service returns a promise
    var User = $q.defer();
    var userResource = $resource('/auth/me', {});
    var user = {};

    // if the user lookup has not happened yet, cached will be falsy, and we do the query
    if (!User.cached) {
      lookupUser();
    }

    // return the User promise
    return User;

    function lookupUser() {
      // as soon as the lookup has begun we set the cached property to true so that other
      // controllers or services that rely on Authentication won't kick off the query again.
      User.cached = true;


      var userMethods = {
        hasRole: function hasRole(roles) {
          return !!(_.intersection(user.roles, roles).length);
        },
        isMe: function isMe(givenUser) {
          return givenUser._id === user._id;
        },
        refresh: refreshUser,
        auth: $resource('/auth/login', {}, {
          login: {
            method: 'POST'
          },
          signup: {
            method: 'POST',
            url: '/auth/signup'
          },
          signin: {
            method: 'POST',
            url: '/auth/signin'
          },
          forgotPassword: {
            method: 'POST',
            url: '/auth/forgotPassword'
          },
          validateToken: {
            method: 'GET',
            url: '/auth/resetPassword/:token',
            params: {
              'token': '@token'
            }
          },
          resetPassword: {
            method: 'POST',
            url: '/auth/resetPassword/:token',
            params: {
              'token': '@token'
            }
          }
        })
      };

      userResource.get().$promise
        .then(function (result) {
            user = result;
            user.cached = true;
            // add our custom methods to the user instance
            angular.extend(user, userMethods);
            // resolve the promise with the user Object
            User.resolve(user);
          })
        .catch(function (err) {
            User.reject(err);
          });
    }

    function refreshUser() {
      userResource.get().$promise
        .then(function (result) {
          user._id = result._id || user._id;
          user.displayName = result.displayName || user.displayName;
          user.honorific = result.honorific || user.honorific;
          user.firstName = result.firstName || user.firstName;
          user.lastName = result.lastName || user.lastName;
          user.roles = result.roles || user.roles;
          user.email = result.email || user.email;
          $state.go('main.home');
        });
    }
  }
})();
