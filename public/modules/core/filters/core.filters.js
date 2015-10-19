(function () {
  'use strict';
  angular
    .module('core')
    .filter('standardDate', standardDate)
    .filter('checkMark', checkMark)
    .filter('trimmed', trimmed)
    .filter('humanize', humanize);

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

  function humanize() {
    return function (input) {
      var words = input.match(/[A-Za-z][a-z]*/g);
      return words.map(capitalize).join(' ');

      function capitalize(word) {
        return word.charAt(0).toUpperCase() + word.substring(1);
      }
    };
  }
})();
