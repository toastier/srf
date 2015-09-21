angular
  .module('core')
  .directive('duTable', duTable);

/**
 * works with the Pagination service to output the paginated results
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
    //@todo filter (eg, currency, date, etc) should come from the configuration and be handeled in the controller ideally
    var duTable = this;
    
    duTable.getIndex = utility.getIndex;
    duTable.collection = $scope.vm.collection;

  }
}