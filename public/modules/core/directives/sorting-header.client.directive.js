(function () {
  'use strict';
  angular
    .module('core')
    .directive('duSortingHeader', duSortingHeader);

  /**
   * A shared scope directive that provides row and th elements for sortable table headers
   * assumes that the following functions exist on the view model (vm)
   * vm.sortBy(predicate) to sort rows
   * vm.sortingClass(predicate) to provide css classes to ng-class
   * Assumes that a tableColumns array exists on the view model (vm), containing Objects with the following properties:
   * field: the field to sort by
   * label: the label for the column header
   * @returns {{restrict: string, templateUrl: string}}
   */
  function duSortingHeader() {
    return {
      restrict: 'A',
      templateUrl: 'modules/core/directives/sorting-header.client.partial.html'
    };
  }
})();
