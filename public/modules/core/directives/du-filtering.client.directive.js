(function () {
  'use strict';
  angular
    .module('core')
    .directive('duFiltering', duFiltering);

  function duFiltering () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'modules/core/directives/partials/du-filtering.client.partial.html',
      controller: duFilteringController,
      controllerAs: 'duFilter'
    };

    function duFilteringController ($scope, utility) {

      var duFilter = this;
      duFilter.filters = [];

      $scope.$watch('vm.collection', function() {
        setupFilters();
      });

      function setupFilters () {
        if($scope.vm.collection) {
          duFilter.filterCriteria = $scope.vm.collection.filterCriteria;
          angular.forEach($scope.vm.collection.columnDefinitions, function(columnDefinition) {
            if(columnDefinition.filterable) {
              var cols = (columnDefinition.filterable.size) ? columnDefinition.filterable.size : 4;
              var filterCriteria = getFilterCriteriaReference(columnDefinition.field);
              var filter = {
                label: columnDefinition.label,
                cols: cols,
                model: filterCriteria.model,
                index: filterCriteria.index
              };
              duFilter.filters.push(filter);
            }
          });
        }
      }

      function getFilterCriteriaReference (fieldName) {
        var pass = 0;
        var ref = [];
        ref[0] = $scope.vm.collection.filterCriteria;
        var fieldNameAsArray = fieldName.split('.');

        function bracketIt(fieldNameArray) {
          pass++;
          ref[pass] = ref[pass - 1][fieldNameArray[0]];
          fieldNameArray.splice(0,1);
          if (fieldNameArray.length > 1 ) {
            bracketIt(fieldNameArray);
          }
        }

        bracketIt(fieldNameAsArray);
        return {model: ref[pass], index: fieldNameAsArray[0] };
      }

    }
  }
})();
