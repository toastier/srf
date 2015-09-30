'use strict';

//Applications service used for communicating with the applications REST endpoints
angular.module('applications').factory('Applications', ['$resource', function($resource) {
    return $resource('applications/:applicationId', {
        applicationId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);