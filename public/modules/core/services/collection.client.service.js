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
       * @typedef ColumnDefinition
       * @param {string} field
       * @param {string} label
       * @param {Object} actions
       * @param {Function} actions.restrict
       * @param {Object[]} actions.actionItems
       * @param {string} actions.actionItems.type
       * @param {string} actions.actionItems.title
       * @param {Function} actions.actionItems.restrict
       * @param {string} actions.actionItems.attachedTo
       * @param {Function | string} actions.actionItems.method
       * @param {Boolean | Object=} sortable
       * @param {Boolean | Object=} filterable
       * @param {string} filterable.name
       * @param {string} filterable.field
       * @param {string} filterable.matchType
       * @constructor
       */
      var ColumnDefinition = function(field, label, actions, sortable, filterable) {
        /** @type string | null **/
        this.field = field || null;
        /** @type string | null **/
        this.label = label || null;
        /** @type Object **/
        this.actions = actions || null;
        /** @type Boolean | null **/
        this.sortable = sortable || null;
        /** @type Boolean | null **/
        this.filterable = filterable || null;
      };

      /**
       * Constructor function for Collection
       * @typedef Collection
       * @constructor
       * @param {string} identifier A unique identifier to be used with useCache is true as part of caching
       * @param {Object[]} members
       * @param {ColumnDefinition[]} columnDefinitions An Array of ColumnDefinition Object(s)
       * @param {string[]} initialSortOrder Predicate(s) to sort by
       * @param {Boolean=} useCache Whether or not to use caching in the Collection
       * @returns {Collection}
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
          /*eslint no-use-before-define: 0 */
          collection.matched = filtering.doFiltering();
          paginate();
        }

        function clearFilters() {
          /*eslint no-use-before-define: 0 */
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
            Pagination.paginator.currentPage = 1;
            paginate();

            var filtering = new Filtering(collection.original, collection.matched);
            var filterConfigurationArray = filtering.buildFilterConfigurationArray(columnDefinitions);
            filtering.addFilterDefinitions(filterConfigurationArray);

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
