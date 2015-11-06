(function () {
  'use strict';
  angular
    .module('core')
    .controller('BreadcrumbsController', BreadcrumbsController);

  function BreadcrumbsController(Navigation) {

    var breadcrumbs = this;
    breadcrumbs.here = Navigation.breadcrumbs.get();

  }
})();
