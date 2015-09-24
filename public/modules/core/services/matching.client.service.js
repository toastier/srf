(function () {
  'use strict';
  angular
    .module('core')
    .factory('Matching', Matching);
  /**
   * Utility functions for doing matching
   *
   * @returns {{stringInString: Function, trueMatch: Function, numberMatch: Function}}
   * @constructor
   */
  function Matching() {
    return {
      /**
       * provides simple wildcard search with a boolean return.
       *
       * @param needle
       * @param haystack
       * @returns {boolean}
       */
      stringInString: function (needle, haystack) {
        if (!needle || needle === '' || needle === null) {
          return true;
        }
        if (!haystack) {
          return false;
        }
        if (!angular.isString(needle)) {
          needle = needle.toString();
        }
        if (!angular.isString(haystack)) {
          haystack = haystack.toString();
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
      },
      trueMatch: function (toMatch, matchAgainst) {
        if (matchAgainst === undefined || matchAgainst === null) {
          return true;
        }
        if (toMatch === null) {
          return true;
        }
        return (matchAgainst === toMatch);
      },
      /**
       * provides matching for filtering
       *
       * @param value the data value we are checking
       * @param criteria the criteria for the match
       * @returns {boolean}
       */
      trueFalse: function (criteria, value) {
        if (criteria === undefined || criteria === '' || criteria === null) {
          return true;
        }

        return (!!value === !!criteria);
      },
      numberMatch: function (toMatch, matchAgainst) {
        if (matchAgainst === undefined || matchAgainst === null) {
          return true;
        }
        if (toMatch === null || toMatch === undefined) {
          return true;
        }
        if (angular.isString(toMatch)) {
          toMatch = parseInt(toMatch, 10);
        }
        if (angular.isString(matchAgainst)) {
          matchAgainst = parseInt(matchAgainst, 10);
        }
        return (matchAgainst === toMatch);
      }
    };
  }
})();
