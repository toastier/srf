(function () {
  'use strict';
  angular
    .module('core')
    .filter('standardDate', standardDate)
    .filter('checkMark', checkMark)
    .filter('trimmed', trimmed);

  function standardDate($filter) {
    var angularDateFilter = $filter('date');
    return function (input) {
      input = input || '';
      return angularDateFilter(input, 'MMM dd, yyyy');
    };
  }


  function checkMark() {
    return function (input) {
      if (input === 1 || input === true) {
        return '\u2713';
      } else {
        return '\u2718';
      }
    };
  }

  function trimmed(_) {
    return function (input) {
      return _.trunc(input, {
        'length': 200,
        'separator': /,? +/
      });
    };
  }
})();
