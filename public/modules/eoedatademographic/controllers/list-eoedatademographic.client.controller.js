(function () {
  'use strict';
  angular
    .module('eoeDataDemographic')
    .controller('ListEoeDataDemographicController', ListEoeDataDemographicController);

  function ListEoeDataDemographicController($scope, $state, Navigation, EoeDataDemographic, CollectionModel, Messages, resolvedAuth) {
    var vm = this;
    vm.noFilteringDirective = true;
    vm.user = resolvedAuth;
    vm.allowEdit = allowEdit;
    vm.allowView = allowView;
    vm.isActiveYes = true;
    vm.isActiveNo = false;
    vm.setIsActive = setIsActive;

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
        field: 'opening.name',
        label: 'Opening',
        filterable: true
      },
      {
        field: 'gender', label: 'Gender',
          filterable: {
            name: 'gender',
            field: 'gender'
          }
      },
     {
        field: 'ethnicity', label: 'Hispanic',
          filterable: {
            name: 'hispanic',
            field: 'hispanic'
          }
      },
     {
        field: 'race.black', label: 'Black', format: 'checkMark',
          filterable: {
            name: 'black',
            field: 'black',
            matchType: 'trueFalse'
          }
      },
      {
        field: 'race.multiple', label: 'Multiple', format: 'checkMark',
          filterable: {
            name: 'multiple',
            field: 'multiple',
            matchType: 'trueFalse'
          }
      },
      {
        field: 'race.white', label: 'White', format: 'checkMark',
          filterable: {
            name: 'white',
            field: 'white',
            matchType: 'trueFalse'
          }
      },
      {
        field: 'race.pacific', label: 'Pacific', format: 'checkMark',
          filterable: {
            name: 'pacific',
            field: 'pacific',
            matchType: 'trueFalse'
          }
      },
      {
        field: 'race.native', label: 'Native', format: 'checkMark',
          filterable: {
            name: 'native',
            field: 'native',
            matchType: 'trueFalse'
          }
      },
      {
        field: 'race.declined', label: 'declined', format: 'checkMark',
          filterable: {
            name: 'declined',
            field: 'declined',
            matchType: 'trueFalse'
          }
      }
    ];

    var initialSortOrder = ['+opening'];

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation

      var actions = EoeDataDemographic.getActions(); // get the actions from the Model
      actions.splice(1, 2); // splice out the ones we don't want (were taking them all out here)

      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('EOE Data - Demographics'); // set the page title
    }

    function activate () {

      // if the user is not logged in, or is logged in but doesn't have rights
      if(!vm.user._id || !vm.user.hasRole(['admin', 'committee member'])) {
        // modify the columnDefinitions to limit what they see, remove 'active' and 'posting'
        vm.columnDefinitions.splice(3,2);
        EoeDataDemographic.listCurrent().$promise
            .then(function (result) {

              new CollectionModel('ListEoeDataDemographicControllerPublic', result, vm.columnDefinitions, initialSortOrder)
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

      EoeDataDemographic.query().$promise
          .then(function(result) {
            Messages.addMessage('Openings Loaded', 'success', null, 'dev');

            new CollectionModel('EoeDataDemographicController', result, vm.columnDefinitions, initialSortOrder)
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
    function viewEoeDataDemographic (EoeDataDemographic) {
      $state.go('main.viewEoeDataDemographic', { EoeDataDemographicId: EoeDataDemographic._id });
    }

    activate();

  }
})();
