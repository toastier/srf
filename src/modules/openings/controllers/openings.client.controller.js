(function () {
  'use strict';
  angular
    .module('openings')
    .controller('OpeningsController', OpeningsController);

  function OpeningsController($scope, $state, Navigation, Opening, CollectionModel, Messages, resolvedAuth, RouterTracker) {
    var vm = this;
    vm.noFilteringDirective = true;
    vm.user = resolvedAuth;
    vm.allowEdit = allowEdit;
    vm.allowView = allowView;
    vm.isActiveYes = true;
    vm.isActiveNo = false;
    vm.currentOnly = true;
    vm.setIsActive = setIsActive;
    vm.setCurrentOnlyFilter = setCurrentOnlyFilter;

    function allowView () {
      return true;
    }

    function allowEdit () {
      return vm.user.hasRole(['admin']);
    }

    function setIsActive (source) {
      if (source === 'isActiveYes') {
        if (vm.isActiveYes) {
          vm.isActiveNo = false;
          vm.collection.filterCriteria.isActive = true;
        } else {
          vm.collection.filterCriteria.isActive = null;
        }
      } else {
        if (vm.isActiveNo) {
          vm.isActiveYes = false;
          vm.collection.filterCriteria.isActive = false;
        } else {
          vm.collection.filterCriteria.isActive = null;
        }
      }
      vm.collection.filterCollection();
    }

    /** @type ColumnDefinition[] **/
    vm.columnDefinitions = [
      {
        field: 'name',
        label: 'Opening Title',
        sortable: true,
        filterable: true,
        actions: {
          restrict: vm.allowView,
          actionItems: [
            {
              type: 'edit',
              title: 'Edit Opening',
              restrict: vm.allowEdit,
              attachedTo: 'item',
              method: 'editOpening' // use as string reference to the action as it is attached to the 'item' in the collection and is not available in the current scope
            },
            {
              type: 'view',
              title: 'View Opening',
              restrict: vm.allowView,
              attachedTo: 'controller',
              method: viewOpening  // object reference to the method as it is in the current scope
            }
          ]
        }},
      {field: 'details', label: 'Description', format: 'trimmed', sortable: true, filterable: true},
      {field: 'requisitionNumber', label: 'Requisition Number', sortable: true, filterable: true},
      {field: 'isActive', label: 'Active', format: 'checkMark', sortable: true,
        filterable: {
          name: 'isActive',
          field: 'isActive',
          matchType: 'trueFalse'
        }
      },
      {field: 'datePosted', label: 'Posting', format: 'date', sortable: true},
      {field: 'dateStart', label: 'Opening', format: 'date', sortable: true,
        filterable: {
          name: 'dateStart',
          field: 'dateStart',
          matchType: 'isDateLessThan'
        }
      },
      {field: 'dateClose', label: 'Closing', format: 'date', sortable: true,
        filterable: {
          name: 'dateClose',
          field: 'dateClose',
          matchType: 'isDateGreaterThan'
        }
      }
    ];

    var initialSortOrder = ['+name'];

    function setCurrentOnlyFilter() {
      if(vm.currentOnly) {
        vm.collection.filterCriteria.dateStart = Date.now();
        vm.collection.filterCriteria.closeDate = Date.now();
      } else {
        vm.collection.filterCriteria.dateStart = null;
        vm.collection.filterCriteria.closeDate = null;
      }
      vm.collection.filterCollection();
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation

      var actions = Opening.getActions(); // get the actions from the Model
      if (vm.user.hasRole(['admin', 'manager'])) {
        actions.splice(1, 2); // splice out the ones we don't want (leaving create for admin or manager)
      } else {
        actions = []; // not admin or manager, so we set actions to an empty array - nothing for you here....
      }

      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Openings'); // set the page title
    }

    /**
     * setup the nav for Users without privileges.
     */
    function setupPublicNavigation() {
      Navigation.clear();
      Navigation.viewTitle.set('Current Openings');
    }

    function activate () {

      // if the user is not logged in, or is logged in but doesn't have rights
      if(!vm.user._id || !vm.user.hasRole(['admin', 'manager', 'committee member'])) {
        // modify the columnDefinitions to limit what they see, remove 'active' and 'posting'
        vm.columnDefinitions.splice(3,2);
        Opening.listCurrent().$promise
          .then(function (result) {

            new CollectionModel('OpeningsControllerPublic', result, vm.columnDefinitions, initialSortOrder)
              .then(function (collection) {
                vm.collection = collection;
              });
          })
          .catch(function (err) {
            Messages.addMessage(err.data.message, 'error');
          });
        setupPublicNavigation();
        return 'done';
      }

      Opening.query().$promise
        .then(function(result) {
          Messages.addMessage('Openings Loaded', 'success', null, 'dev');

          new CollectionModel('OpeningsController', result, vm.columnDefinitions, initialSortOrder)
            .then(function(collection) {
              vm.collection = collection;
              setCurrentOnlyFilter();

              // watch for change when filters are cleared, and set UI variables/controls appropriately
              $scope.$watch('vm.collection.filterCriteria.isActive', function(newValue) {
                switch (newValue) {
                  case true:
                    vm.isActiveYes = true;
                    vm.isActiveNo = false;
                    break;
                  case false:
                    vm.isActiveNo = true;
                    vm.isActiveYes = false;
                    break;
                  default:
                    vm.isActiveYes = null;
                    vm.isActiveNo = null;
                }
              });
            })
            .catch(function(err) {
              Messages.addMessage(err.data.message, 'error');
            });

      });
      vm.routeHistory = RouterTracker.getRouteHistory();
      setupNavigation();
    }

    function viewOpening (opening) {
      $state.go('main.viewOpening', { openingId: opening._id });
    }

    activate();

  }
})();
