/**
 * Service for Uploads.  Not in use currently, as there are upload methods on the applications service,
 * and retreiving files via XHR is problematic, however I'm leaving this in a a stub
 */
(function () {
  'use strict';

  angular
    .module('core')
    .factory('Uploads', Uploads);

  /* @ngInject */
  function Uploads($resource) {
    var service = $resource('uploads/file/:fileId', {fileId: '@_id'}, {
      viewFile: {
        method: 'GET',
        responseType: 'arraybuffer'
      }
    });

    return service;

    ////////////////

  }
})();
