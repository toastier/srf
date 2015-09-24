(function () {
  'use strict';
  angular
    .module('core')
    .directive('duTable', duTable);

  /**
   * Works with the CollectionModel service to display tabular / paginated / sortable items.
   *
   * In your controller, set the vm.collection = new CollectionModel('identifier', data, ColumnDefinitions, initialSortOrder)
   *
   * @returns {{restrict: string, templateUrl: string, controller: duTableController, controllerAs: string}}
   */
  function duTable() {
    return {
      restrict: 'E',
      templateUrl: 'modules/core/directives/partials/du-table.client.partial.html',
      controller: duTableController,
      controllerAs: 'duTable'
    };

    function duTableController($scope, utility) {
      //@todo filter (eg, currency, date, etc) should come from the configuration and be handled in the controller ideally
      var duTable = this;

      duTable.getIndex = utility.getIndex;
      duTable.collection = $scope.vm.collection;
      duTable.callMethod = function (item, method, attachedTo) {
        attachedTo = attachedTo || 'item';
        if (attachedTo === 'item' && angular.isString(method)) {
          method = duTable.getIndex(item, method);
        }
        if (angular.isFunction(method)) {
          method(item);
        }
      };
    }
  }
})();
