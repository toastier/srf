'use strict';

/**
 * @returns {{paginator: {currentPage: number, itemsPerPage: number, maxSize: number, paginationOptions: *[]}, paginate: Function}}
 * @constructor
 */
function Pagination() {

  var output = {
    records: undefined
  };

  /**
   * paginator configuration object for ui-bootstrap
   * @type {{currentPage: number, itemsPerPage: number, totalPages: number, maxSize: number, paginationOptions: *[]}}
   */
  var paginator = {
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 0,
    maxSize: 20,
    paginationOptions: [
      {items: 10},
      {items: 20},
      {items: 30},
      {items: 50},
      {items: 100},
      {items: 200}
    ]
  };

  /**
   * performs pagination
   * @param matchedRecords
   * @returns {*}
   */
  var paginate = function(matchedRecords) {
    var begin = ((paginator.currentPage - 1) * paginator.itemsPerPage);
    var end = begin + paginator.itemsPerPage;

    paginator.totalPages = Math.ceil(matchedRecords.length / paginator.itemsPerPage);

    output.records = matchedRecords.slice(begin, end);

    return output.records;
  };

  return {
    paginator: paginator,
    paginate: paginate,
    output: output
  };
}


angular
  .module('core')
  .factory('Pagination', Pagination);
