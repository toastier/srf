(function () {
  'use strict';
  angular
    .module('openings')
    .controller('OpeningsController', OpeningsController);

  function OpeningsController($scope, $state, Navigation, Opening, CollectionModel, Messages, resolvedAuth) {
    var vm = this;
    vm.noFilteringDirective = true;
    vm.user = resolvedAuth;
    vm.allowEdit = allowEdit;
    vm.isActiveYes = true;
    vm.isActiveNo = false;
    vm.setIsActive = setIsActive;

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
          restrict: vm.allowEdit,
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
              restrict: vm.allowEdit,
              attachedTo: 'controller',
              method: viewOpening  // object reference to the method as it is in the current scope
            }
          ]
        }},
      {field: 'details', label: 'Description', format: 'trimmed', sortable: true, filterable: true},
      {field: 'isActive', label: 'Active', format: 'checkMark', sortable: true,
        filterable: {
          name: 'isActive',
          field: 'isActive',
          matchType: 'trueFalse'
        }
      },
      {field: 'datePosted', label: 'Posting', format: 'date', sortable: true},
      {field: 'dateStart', label: 'Opening', format: 'date', sortable: true},
      {field: 'dateClose', label: 'Closing', format: 'date', sortable: true}
    ];

    var initialSortOrder = ['+name'];

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation

      var actions = Opening.getActions(); // get the actions from the Model
      actions.splice(1, 2); // splice out the ones we don't want (were taking them all out here)

      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Openings'); // set the page title
    }

    function activate () {
      Opening.query().$promise
        .then(function(result) {
          Messages.addMessage('Openings Loaded', 'success', null, 'dev');

          new CollectionModel('OpeningsController', result, vm.columnDefinitions, initialSortOrder)
            .then(function(collection) {
              vm.collection = collection;

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
      setupNavigation();
    }

    function viewOpening (opening) {
      $state.go('main.viewOpening', { openingId: opening._id });
    }

    activate();

  }
})();
