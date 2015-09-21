'use strict';

function BreadcrumbsController(Navigation) {

  var crumbs = this;

  crumbs.here = Navigation.breadcrumbs.get();

}

angular
  .module('core')
  .controller('BreadcrumbsController', BreadcrumbsController);