'use strict';
angular
.module('core')
.service('Filtering', Filtering);

function Filtering($filter, Matching) {

  return function (collection, matchedCollection) {

    var filtering = this;
    filtering.collection = collection;
    filtering.matched = matchedCollection;

    var filterDefinitions = [];
    var filterCriteria = {};

    /**
     * Builds a filterConfigurationArray from the provided tableConfigurationArray
     * @param tableConfigurationArray [{{field: String, label: String, sortable: bool, filterable: bool | Object{name: String, field: String, matchType: String}}}]
     * @returns {Array}
     */
    function buildFilterConfigurationArray (tableConfigurationArray) {
      var result = [];

      function createFilterDefinitionObject (column) {
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

          return {name: name, field: field, matchType: matchType}
        }
        //not a filterable column, return false;
        return false;
      }

      angular.forEach(tableConfigurationArray, function (column) {
        var filter = createFilterDefinitionObject(column);
        if (filter) {
          result.push(filter);
        }
      });

      return result;
    }

    /**
     * add a single Data Filter
     * @param filterConfiguration FilterConfigurationObject{{name: String, field: String, matchType: String}}
     */
    function addFilterDefinition (filterConfiguration) {
      /**
       * sets an index
       * @param obj the object from which we want to set the index
       * @param is string representation of the index
       * @param value
       * @returns {*}
       */
      function setIndex(obj, is, value) {
        if (typeof is == 'string'){
          return setIndex(obj, is.split('.'), value);
        }
        else if (is.length == 1 && angular.isDefined(value)) {
          return obj[is[0]] = value;
        }
        else if (is.length == 0) {
          return obj;
        }
        else {
          if(!obj[is[0]]) {
            obj[is[0]] = {};
          }
          return setIndex(obj[is[0]], is.slice(1), value);
        }
      }

      /**
       * gets an index
       * @param obj the object from which we want to retrieve the index value
       * @param is string representation of the index
       * @param value
       * @returns {*}
       */
      function getIndex(obj, is, value) {
        if (typeof is == 'string'){
          return getIndex(obj, is.split('.'), value);
        }
        else if (is.length == 1 && angular.isDefined(value)) {
          return obj[is[0]] = value;
        }
        else if (is.length == 0) {
          return obj;
        }
        else if (!obj) {
          return null;
        }
        else {
          return getIndex(obj[is[0]], is.slice(1), value);
        }
      }

      function createFilter(name, field, matchType) {

        function filterFunction (item) {

          var criteria = getIndex(filterCriteria, name);
          var value = getIndex(item, field);

          return !!Matching[matchType](criteria, value);
        }

        return function () {
          filtering.matched = $filter('filter')(filtering.matched, filterFunction)
        }
      }

      if (angular.isObject(filterConfiguration)) {
        var name = filterConfiguration.name || null;
        var field = filterConfiguration.field || null;
        var matchType = filterConfiguration.matchType || 'stringInString';

        if (name && field && matchType) {
          filterDefinitions.push({name: name, filter: createFilter(name, field, matchType)});

          setIndex(filterCriteria, name, null);

        }
      }
    }

    /**
     * add multiple filterDefinitions
     * @param filterConfigurationArray FilterConfigurationObject
     */
    function addFilterDefinitions (filterConfigurationArray) {
      angular.forEach(filterConfigurationArray, function (filterConfiguration){
        addFilterDefinition(filterConfiguration);
      })
    }

    /**
     * apply filters
     */
    function doFiltering () {
      filtering.matched = angular.copy(filtering.collection);
      angular.forEach(filterDefinitions, function (filterDefinition) {
        filterDefinition.filter();
      });

      return filtering.matched;
    }

    /**
     * resets all values in filterCriteria array to null. Uses recursion to maintain nested keys.
     */
    function clearFilters () {

      doClear(filterCriteria);

      function doClear(criteria) {
        angular.forEach(criteria, function (filterValue, filterKey, criteriaObject) {
          if(!angular.isObject(filterValue)) {
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
    }
  };
}