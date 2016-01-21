(function () {
  'use strict';
  angular
    .module('positions')
    .controller('PositionsController', PositionsController);

  function PositionsController($scope, $state, Navigation, Position, CollectionModel, Messages, resolvedAuth) {
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

    /** type ColumnDefinition[] **/
    vm.columnDefinitions = [
      {
        label: 'Actions',
        actions: {
          restrict: vm.allowEdit,
          actionItems: [
            {
              type: 'edit',
              title: 'Edit Position',
              restrict: vm.allowEdit,
              attachedTo: 'item',
              method: 'editPosition' // use as string reference to the action as it is attached to the 'item' in the collection and is not available in the current scope
            },
            {
              type: 'view',
              title: 'View Position',
              restrict: vm.allowEdit,
              attachedTo: 'controller',
              method: viewPosition  // object reference to the method as it is in the current scope
            }
          ]
        },
        width: { sm: 1}
      },
      {
        field: 'name',
        label: 'Position Title',
        filterable: true,
        width: { sm: 3}
      },
      {field: 'details', label: 'Description', format: 'trimmed', filterable: true, width: { sm: 3, xs: 0}},
      {field: 'isActive', label: 'Active', format: 'checkMark',
        filterable: {
          name: 'isActive',
          field: 'isActive',
          matchType: 'trueFalse'
        },
        width: { sm: 1}
      },
      {field: 'dateCreated', label: 'Created', format: 'date', width: { sm: 2}}
    ];

    var initialSortOrder = ['+name'];

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation

      var actions = Position.getActions(); // get the actions from the Model
      actions.splice(1, 2); // splice out the ones we don't want (were taking them all out here)

      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Positions'); // set the page title
    }

    function activate () {
      Position.query().$promise
        .then(function(result) {
          Messages.addMessage('Positions Loaded', 'success', null, 'dev');
          new CollectionModel('PositionsController', result, vm.columnDefinitions, initialSortOrder)
            .then(function (positions) {
              vm.collection = positions;
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
            .catch(function (err) {
              Messages.addMessage(err.data.message, 'error');
            });
      });
      setupNavigation();
    }

    function viewPosition (position) {
      $state.go('main.viewPosition', { positionId: position._id });
    }

    activate();

  }
})();
