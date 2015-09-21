(function() {
  'use strict';
  angular
    .module('core')
    .provider('CollectionModel', CollectionModel);

  function CollectionModel() {

    this.$get = providerGetFunction;

    /**
     * Provides a singular, opinionated way of handling a collection of members, and performing filtering, sorting and pagination
     * works with duTable directive to allow easy creation of tables based on configuration objects
     * @param Sorting
     * @param Filtering
     * @param Pagination
     * @param _ {Function} lodash
     * @returns {Function}
     */
    function providerGetFunction (Sorting, Filtering, Pagination, _ ) {

      /**
       * Constructor function for Collection
       * @typedef Collection
       * @constructor
       * @param {string} identifier A unique identifier to be used with useCache is true as part of caching
       * @param {Object[]} members
       * @param {Object[]} columnDefinitions
       * @param {string} columnDefinitions.field The field. You can use Dot Notation
       * @param {string} columnDefinitions.label The label to be displayed on heading column
       * @param {Boolean=} columnDefinitions.sortable Whether to enable sorting for the given column.
       * @param {Boolean=} columnDefinitions.filterable Whether to enable filtering for the given column.
       * @param {Object=} columnDefinitions.action Object defining actions to be provided to the end user.
       * @param {Object} columnDefinitions.action.restrict Method to determine whether action should be enabled in the UI
       * @param {Object[]} columnDefinitions.action.items Array of actions to provide in the UI
       * @param {string} columnDefinitions.actions.items.type Used to set the class of action control
       * @param {string} columnDefinitions.actions.items.title Title shown in tooltip
       * @param {Object} columnDefinitions.actions.items.method Method to invoke when clicking on action in the UI
       * @param {Object} columnDefinitions.actions.items.restrict Function to determine whether action should be enabled in the UI
       * @param {string[]} initialSortOrder Predicate(s) to sort by
       * @param {Boolean} useCache Whether or not to use caching in the Collection
       * @returns {*}
       */
      var Collection = function Collection (identifier, members, columnDefinitions, initialSortOrder, useCache) {

        var collection = this;

        function sortBy (predicate) {
          Sorting.prependToSortOrder(predicate);
          paginate();
        }

        function paginate () {
          collection.paginated = Sorting.sortThenPaginate(collection.matched, collection.paginated);
        }

        function filterCollection () {
          collection.matched = filtering.doFiltering();
          paginate();
        }

        function clearFilters() {
          filtering.clearFilters();
          filterCollection();
        }

        // If there is an item in the cache matching the identifier, and that item has the 'original' property with records
        // we simply return the cached item, which is the collection set from the controller
        if (Collection.cached[identifier] && Collection.cached[identifier].original && Collection.cached[identifier].original.length && useCache) {
          return Collection.cached[identifier];
        } else {
          // Either there is nothing in the cache matching the identifier, or there is a matching entry with no records
          // If constructor has been invoked with the members and columnDefinitions parameters, we use that data to setup the
          // new collection

          if (members && columnDefinitions) {
            initialSortOrder = initialSortOrder || null;
            Sorting.setSortOrder(initialSortOrder);
            collection.original = members || null;
            collection.matched = angular.copy(collection.original);

            paginate();

            var filtering = new Filtering(collection.original, collection.matched);
            var filtersDefinitionArray = filtering.buildFilterConfigurationArray(columnDefinitions);
            filtering.addFilterDefinitions(filtersDefinitionArray);

            /**
             * methods API
             * @type {{clearFilters: clearFilters, filterCollection: filterCollection, getSortingClass: (Function|sortingClass|f|*), paginate: paginate, setInitialSortOrder: (Function|setSortOrder|s), sortBy: sortBy}}
             */
            var methods = {
              clearFilters: clearFilters,
              filterCollection: filterCollection,
              getSortingClass: Sorting.sortingClass,
              paginate: paginate,
              setInitialSortOrder: Sorting.setSortOrder,
              sortBy: sortBy
            };

            var properties = {
              filterCriteria: filtering.filterCriteria,
              paginator: Pagination.paginator,
              columnDefinitions: columnDefinitions || null
            };

            /**
             * add methods to the collection
             */
            _.assign(collection, methods, properties);

          }

          // finish by assigning this collection to Collection.cached[identifier], and returning it
          Collection.cached[identifier] = collection;
        }

      };
      Collection.cached = {};
      return Collection;
    }
  }
})();