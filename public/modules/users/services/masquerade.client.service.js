(function () {
  'use strict';
  function Masquerade($resource) {
    return $resource('users/masquerade', {}, {
      do: {
        method: 'POST'
      }
    });
  }

  angular
    .module('users')
    .factory('Masquerade', Masquerade);
})();
