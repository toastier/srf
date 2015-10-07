(function () {
  'use strict';
  angular
    .module('eoedata')
    .controller('ListEoedataController', ListEoedataController);

  function ListEoedataController($scope, $state, Navigation, Eoedata, CollectionModel, Messages, resolvedAuth) {
    var vm = this;
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
        label: 'Eoedata Title',
        filterable: true,
        actions: {
          restrict: vm.allowEdit,
          actionItems: [
            {
              type: 'edit',
              title: 'Edit Eoedata',
              restrict: vm.allowEdit,
              attachedTo: 'item',
              method: 'editEoedata' // use as string reference to the action as it is attached to the 'item' in the collection and is not available in the current scope
            },
            {
              type: 'view',
              title: 'View Eoedata',
              restrict: vm.allowEdit,
              attachedTo: 'controller',
              method: viewEoedata  // object reference to the method as it is in the current scope
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
      {field: 'datePosted', label: 'Posting', format: 'date'},
      {field: 'dateStart', label: 'Eoedata', format: 'date'},
      {field: 'dateClose', label: 'Closing', format: 'date'}
    ];

    var initialSortOrder = ['+name'];

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation

      var actions = Eoedata.getActions(); // get the actions from the Model
      actions.splice(1, 2); // splice out the ones we don't want (were taking them all out here)

      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Eoedata'); // set the page title
    }

    function activate () {
      Eoedata.query().$promise
        .then(function(result) {
          Messages.addMessage('Eoedata Loaded', 'success', null, 'dev');
          vm.collection = new CollectionModel('EoedataController', result, vm.columnDefinitions, initialSortOrder);
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

    function viewEoedata (Eoedata) {
      $state.go('main.viewEoedata', { EoedataId: Eoedata._id });
    }

    activate();

  }
})();
