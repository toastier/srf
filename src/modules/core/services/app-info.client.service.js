(function () {
  'use strict';
  angular
    .module('core')
    .service('appInfo', appInfo);

  function appInfo($resource) {

    var info = {};
    var resource = $resource('/app-info', {});

    function init() {
      if (!info.cached) {
        fetchInfo();
      }
      return info;
    }

    function fetchInfo() {
      info.info = resource.get();
      info.cached = true;
    }

    return {
      init: init
    };
  }
})();
