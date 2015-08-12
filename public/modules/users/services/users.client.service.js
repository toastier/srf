'use strict';

// Users service used for communicating with the users REST endpoint
function Users($resource) {
	return $resource('users', {}, {
		update: {
			method: 'PUT'
		}
	});
}

function Roles($resource) {
	return $resource('roles', {}, {
		update: {
			method: 'PUT'
		}
	});
}

angular
	.module('users')
	.factory('Users', Users)
	.factory('Roles', Roles);
