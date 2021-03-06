(function () {
  'use strict';
  angular
    .module('core')
    .filter('checkMark', checkMark)
    .filter('fileSize', fileSize)
    .filter('fileType', fileType)
    .filter('humanize', humanize)
    .filter('standardDate', standardDate)
    .filter('standardDateAtTime', standardDateAtTime)
    .filter('trimmed', trimmed)
    .filter('yesNo', yesNo)
    .filter('yesNoNoDecision', yesNoNoDecision)
  ;

  function standardDate($filter) {
    var angularDateFilter = $filter('date');
    return function (input) {
      input = input || '';
      return angularDateFilter(input, 'MMM dd, yyyy');
    };
  }

  function standardDateAtTime($filter) {
    var angularDateFilter = $filter('date');
    return function (input) {
      input = input || '';
      return angularDateFilter(input, 'MMM dd, yyyy @ hh:mm a');
    };
  }

  function fileSize() {
    return function (input) {
      if (input === null || input === undefined || input === true || input === false) {
        return 'file size not given';
      }

      if (angular.isNumber(input)) {
        input = input / 1024;
        input = Math.floor(input);
        input.toString(10);
        input = input + 'k';
      }

      return input;
    };
  }

  function fileType() {
    return function (input) {
      if (angular.isString(input)) {
        switch (input) {
          case 'application/pdf':
            input = 'Acrobat PDF';
            break;
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            input = 'MS Word XML';
            break;
          case 'application/msword':
            input = 'MS Word';
        }
      }
      return input;
    };
  }

  function checkMark() {
    return function (input) {
      if (input === 1 || input === true || input === 'true' || input === '\u2713') {
        return '\u2713';
      } else if (input === null || input === undefined) {
        return 'Undetermined';
      } else {
        return '\u2718';
      }
    };
  }

  function yesNoNoDecision() {
    return function (input) {
      if (input === 1 || input === true || input === 'true' || input === '\u2713') {
        return 'Yes';
      } else if (input === null || input === undefined) {
        return 'No Decision';
      } else {
        return 'No';
      }
    };
  }

  function yesNo() {
    return function (input) {
      if (input === 1 || input === true || input === 'true' || input === '\u2713') {
        return 'Yes';
      } else {
        return 'No';
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

  function toArray(obj, addKey) {
    if (!angular.isObject(obj)) {
      return obj;
    }
    if (addKey === false) {
      return Object.keys(obj).map(function (key) {
        return obj[key];
      });
    } else {
      return Object.keys(obj).map(function (key) {
        var value = obj[key];
        return angular.isObject(value) ?
          Object.defineProperty(value, '$key', {enumerable: false, value: key}) :
        {$key: key, $value: value};
      });
    }
  }
})();
