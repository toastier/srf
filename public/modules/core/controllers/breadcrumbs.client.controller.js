(function () {
  'use strict';
  angular
    .module('core')
    .controller('BreadcrumbsController', BreadcrumbsController);

  function BreadcrumbsController(Navigation) {

    var crumbs = this;

    crumbs.here = Navigation.breadcrumbs.get();

  }
})();
