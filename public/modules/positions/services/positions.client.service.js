'use strict';

//Positions service used for communicating with the positions REST endpoints
angular.module('positions').factory('Positions', ['$resource', function($resource) {
    return $resource('positions/:positionId', {
        positionId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);