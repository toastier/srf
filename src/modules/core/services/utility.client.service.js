(function () {
  'use strict';
  angular
    .module('core')
    .service('utility', utility);

  function utility($q, $timeout) {
    /**
     * sets an index
     * @param obj the object from which we want to set the index
     * @param is string representation of the index
     * @param value
     * @returns {*}
     */
    function setIndex(obj, is, value) {
      if (typeof is == 'string') {
        return setIndex(obj, is.split('.'), value);
      }
      else if (is.length == 1 && angular.isDefined(value)) {
        return obj[is[0]] = value;
      }
      else if (is.length == 0) {
        return obj;
      }
      else {
        if (!obj[is[0]]) {
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
      //handle array
      if(angular.isObject(obj) && angular.isArray(is) && !angular.isUndefined(obj[is[0]]) && angular.isArray(obj[is[0]])) {

        var result = '';
        var isNow = angular.copy(is);
        isNow.splice(0,1);
        var str = isNow.join('.');

        angular.forEach(obj[is[0]], function(each) {
          result = getIndex(each, str) + ', ' + result;
        });

        return result;
      }
      if (typeof is == 'string') {
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

    /**
     * debounce a function
     * @param func
     * @param wait
     * @param immediate
     * @returns {Function}
     */
    function debounce(func, wait, immediate) {
      var timeout;
      var deferred = $q.defer();
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if(!immediate) {
            deferred.resolve(func.apply(context, args));
            deferred = $q.defer();
          }
        };
        var callNow = immediate && !timeout;
        if ( timeout ) {
          $timeout.cancel(timeout);
        }
        timeout = $timeout(later, wait);
        if (callNow) {
          deferred.resolve(func.apply(context,args));
          deferred = $q.defer();
        }
        return deferred.promise;
      };
    }

    return {
      setIndex: setIndex,
      getIndex: getIndex,
      debounce: debounce
    };
  }
})();
