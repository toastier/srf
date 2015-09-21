angular
  .module('core')
  .factory('_', LoDash);

/**
 * wrapping the lodash library in an angular service
 * @param $window
 * @returns {*}
 * @constructor
 */
function LoDash($window) {
  // creating local var for lodash to return as the service
  var _ = $window._;
  // removing lodash from the global scope
  delete($window._);
  // return lodash as an angular service
  return( _ );
}