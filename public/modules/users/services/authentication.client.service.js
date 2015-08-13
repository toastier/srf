'use strict';

function Authentication($resource) {
  var result = {};

  result.refresh = function() {
    result.user = $resource('/auth/me').get();
  };

  if(!result.user) {
    result.refresh();
  }

	return result;
}

angular
	.module('users')
	.factory('Authentication', Authentication);