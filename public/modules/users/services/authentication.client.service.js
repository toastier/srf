angular
	.module('users')
	.service('Authentication', Authentication);

function Authentication($resource, _) {

  var User = {};
  var resource = $resource('/auth/me', {});

  function init () {
    if (!User.cached) {
      lookupUser();
    }
    return User;
  }

  function lookupUser () {
    User.hasRole = function hasRole(roles) {
      return !!(_.intersection(User.user.roles, roles).length);
    };
    User.refresh = function refresh() {
      lookupUser();
    };
    User.user = resource.get();
    User.cached = true;
  }

  return {
    init: init
  };
}

