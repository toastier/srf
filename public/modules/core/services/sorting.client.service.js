'use strict';

/**
 * Service for sorting of record sets
 *
 * @param $q
 * @param $filter
 * @param Matching
 * @returns {{sortRecords: Function, setSortOrder: Function, getSortOrder: Function, prependToSortOrder: Function, sortingClass: Function}}
 * @constructor
 * @param Pagination
 */
function Sorting($q, $filter, Matching, Pagination) {

  var orderBy = $filter('orderBy');
  var sortOrder = [];

  /**
   * setter function for sortOrder array
   * @param sortOrderArray
   */
  var setSortOrder = function(sortOrderArray) {
    sortOrder = sortOrderArray;
  };

  /**
   * getter function for sortOrder array
   * @returns {Array}
   */
  var getSortOrder = function() {
    return sortOrder;
  };

  /**
   * performs sort
   * @param predicate
   * @param reverse
   * @param records
   * @returns {*}
   */
  var sortRecords = function(predicate, reverse, records) {
    records = orderBy(records, predicate, reverse);
    return records;
  };

  /**
   * prepends a predicate to the sortOrder array
   * @param predicate
   * @returns {*}
   */
  var prependToSortOrder = function (predicate) {
    var deferred = $q.defer();
    if (predicate) {
      var position = 0;
      var existingPredicatePosition = null;
      var orderSign = '+';
      angular.forEach(sortOrder, function(existingSortPredicate) {
        if(Matching.stringInString(predicate, existingSortPredicate)) {
          if(existingSortPredicate[0] === '+') {
            orderSign = '-';
          }
          existingPredicatePosition = position;
        }
        position = position + 1;
      });
      if (existingPredicatePosition !== null) {
        sortOrder.splice(existingPredicatePosition, 1);
        sortOrder.splice(3);
      }
      predicate = orderSign + predicate;
      sortOrder.unshift(predicate);
      deferred.resolve(true);
    }
    return deferred.promise;
  };

  /**
   * returns classes for the given predicate based on the presence and position of the predicate in sortOrder array
   * @param predicate
   * @returns {string}
   */
  var sortingClass = function(predicate) {
    var position = 0;
    var sortClass = '';
    var positionClass = '';
    angular.forEach(sortOrder, function(existingSortPredicate) {
      if(Matching.stringInString(predicate, existingSortPredicate)) {
        sortClass = 'sorted';
        if(existingSortPredicate[0] === '-') {
          sortClass = sortClass + ' reverse';
        }
        switch (position) {
          case 0:
            positionClass = ' first';
            break;
          case 1:
            positionClass = ' second';
            break;
          case 2:
            positionClass = ' third';
            break;
          default :
            positionClass = '';

        }
      }
      position = position + 1;
    });
    return sortClass + positionClass;
  };

  var sortThenPaginate = function (matchedCollection, paginatedCollection) {
    matchedCollection = sortRecords(getSortOrder(), false, matchedCollection);
    paginatedCollection = Pagination.paginate(matchedCollection);
    return paginatedCollection;
  };

  return {
    sortRecords: sortRecords,
    setSortOrder: setSortOrder,
    getSortOrder: getSortOrder,
    prependToSortOrder: prependToSortOrder,
    sortingClass: sortingClass,
    sortThenPaginate: sortThenPaginate
  };
}

angular
  .module('core')
  .service('Sorting', Sorting);
