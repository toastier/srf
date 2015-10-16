(function () {
  'use strict';
  angular
    .module('users')
    .service('Authentication', Authentication);

  function Authentication($resource, $q, _ ) {

    // service returns a promise
    var User = $q.defer();
    var userResource = $resource('/auth/me', {});

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

      var user = {};

      var userMethods = {
        hasRole: function hasRole(roles) {
          return !!(_.intersection(user.roles, roles).length);
        },
        refresh: lookupUser,
        auth: $resource('/auth/login', {}, {
          login: {
            method: 'POST'
          },
          signup: {
            method: 'POST',
            url: '/auth/signup'
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
  }
})();
