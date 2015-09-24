(function () {
  'use strict';
  angular
    .module('positions')
    .controller('PositionsController', PositionsController);

  function PositionsController($scope, $state, Authentication, Navigation, Position, CollectionModel, Messages) {
    var vm = this;
    vm.authentication = Authentication.init();
    vm.allowEdit = allowEdit;
    vm.isActiveYes = true;
    vm.isActiveNo = false;
    vm.setIsActive = setIsActive;

    function allowEdit () {
      return vm.authentication.hasRole(['admin']);
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
        field: 'name',
        label: 'Position Title',
        filterable: true,
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
        }},
      {field: 'details', label: 'Description', format: 'trimmed', filterable: true},
      {field: 'isActive', label: 'Active', format: 'checkMark',
        filterable: {
          name: 'isActive',
          field: 'isActive',
          matchType: 'trueFalse'
        }
      },
      {field: 'datePosted', label: 'Posted', format: 'date'},
      {field: 'dateStart', label: 'Opens', format: 'date'},
      {field: 'dateClose', label: 'Closes', format: 'date'}
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
          vm.collection = new CollectionModel('PositionsController', result, vm.columnDefinitions, initialSortOrder);
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
      });
      setupNavigation();
    }

    function viewPosition (position) {
      $state.go('viewPosition', { positionId: position._id });
    }

    activate();

  }
})();
