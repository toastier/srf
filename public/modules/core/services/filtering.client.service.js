(function () {
  'use strict';
  angular
    .module('core')
    .service('Filtering', Filtering);

  function Filtering($filter, Matching, utility) {

    return function (collection, matchedCollection) {

      var filtering = this;
      filtering.collection = collection;
      filtering.matched = matchedCollection;

      var filterDefinitions = [];
      var filterCriteria = {};

      /**
       * Builds a filterConfigurationArray from the provided columnDefinitions
       * @param {ColumnDefinition[]} columnDefinitions
       * @returns {Array}
       */
      function buildFilterConfigurationArray(columnDefinitions) {
        var result = [];

        function createFilterDefinitionObject(column) {
          var name, field, matchType;

          if (angular.isObject(column) && column.filterable && column.field) {

            //set defaults
            name = column.field;
            field = column.field;
            matchType = 'stringInString';

            //if column.filterable is an Object, use values there, if provided
            if (angular.isObject(column.filterable)) {
              if (column.filterable.name) {
                name = column.filterable.name;
              }
              if (column.filterable.field) {
                field = column.filterable.field;
              }
              if (column.filterable.matchType) {
                matchType = column.filterable.matchType;
              }
            }

            return {name: name, field: field, matchType: matchType};
          }
          //not a filterable column, return false;
          return false;
        }

        angular.forEach(columnDefinitions, function (column) {
          var filter = createFilterDefinitionObject(column);
          if (filter) {
            result.push(filter);
          }
        });

        return result;
      }

      /**
       * add a single Data Filter
       * @param {{name: String, field: String, matchType: String}} filterConfiguration
       */
      function addFilterDefinition(filterConfiguration) {

        function createFilter(filterName, filterField, filterMatchType) {

          function filterFunction(item) {

            var criteria = utility.getIndex(filterCriteria, filterName);
            var value = utility.getIndex(item, filterField);

            return !!Matching[filterMatchType](criteria, value);
          }

          return function () {
            filtering.matched = $filter('filter')(filtering.matched, filterFunction);
          };
        }

        if (angular.isObject(filterConfiguration)) {
          var name = filterConfiguration.name || null;
          var field = filterConfiguration.field || null;
          var matchType = filterConfiguration.matchType || 'stringInString';

          if (name && field && matchType) {
            filterDefinitions.push({name: name, filter: createFilter(name, field, matchType)});

            utility.setIndex(filterCriteria, name, null);

          }
        }
      }

      /**
       * add multiple filterDefinitions
       * @param {FilterConfigurationObject} filterConfigurationArray
       */
      function addFilterDefinitions(filterConfigurationArray) {
        angular.forEach(filterConfigurationArray, function (filterConfiguration) {
          addFilterDefinition(filterConfiguration);
        });
      }

      /**
       * apply filters
       */
      function doFiltering() {
        filtering.matched = angular.copy(filtering.collection);
        angular.forEach(filterDefinitions, function (filterDefinition) {
          filterDefinition.filter();
        });

        return filtering.matched;
      }

      /**
       * resets all values in filterCriteria array to null. Uses recursion to maintain nested keys.
       */
      function clearFilters() {

        doClear(filterCriteria);

        function doClear(criteria) {
          angular.forEach(criteria, function (filterValue, filterKey, criteriaObject) {
            if (!angular.isObject(filterValue)) {
              criteriaObject[filterKey] = null;
            } else {
              doClear(filterValue);
            }
          });
        }
      }

      /**
       * public API
       */
      return {
        addFilterDefinition: addFilterDefinition,
        addFilterDefinitions: addFilterDefinitions,
        buildFilterConfigurationArray: buildFilterConfigurationArray,
        clearFilters: clearFilters,
        doFiltering: doFiltering,
        filterCriteria: filterCriteria,
        filtering: filtering
      };
    };
  }
})();
