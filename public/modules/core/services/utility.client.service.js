angular
.module('core')
.service('utility', utility);

function utility() {
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

  return {
    setIndex: setIndex,
    getIndex: getIndex
  }
}