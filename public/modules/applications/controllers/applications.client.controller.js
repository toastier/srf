(function () {
  'use strict';
  angular
    .module('applications')
    .controller('ApplicationsController', ApplicationsController);

  function ApplicationsController($scope, $state, Navigation, CollectionModel, resolvedAuth, Messages, Application) {
    var vm = this;
    vm.user = resolvedAuth;
    vm.allowEdit = allowEdit;
    vm.allowView = allowView;
    /** @type ColumnDefinition[] **/
    vm.columnDefinitions = [
      {field: 'opening.name', label: 'Opening', filterable: true, actions: {
        restrict: allowView,
        actionItems: [
          {
            type: 'edit',
            title: 'Edit Application',
            restrict: vm.allowEdit,
            attachedTo: 'item',
            method: 'editApplication'
          },
          {
            type: 'view',
            title: 'View Application',
            restrict: vm.allowView,
            attachedTo: 'item',
            method: 'viewApplication'
          }
        ]
      }},
      {field: 'applicant.name.honorific', label: 'Hon', filterable: true },
      {field: 'applicant.name.firstName', label: 'First Name', filterable: true },
      {field: 'applicant.name.lastName', label: 'Last Name', filterable: true }
    ];

    function allowEdit () {
      return vm.user.hasRole(['admin']);
    }

    function allowView () {
      return vm.user.hasRole(['admin', 'committee member']);
    }


    var initialSortOrder = ['+position.name'];

    activate();

    function activate() {
      Application.query().$promise
        .then(function(result) {
          Messages.addMessage('Applications Loaded', 'success', null, 'dev');
          vm.collection = new CollectionModel('ApplicationsController', result, vm.columnDefinitions, initialSortOrder);
        })
        .catch(function(err) {
          Messages.addMessage(err.data.message, 'error', 'Problem Loading Applications');
        });

      setupNavigation();
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation

      var actions = Application.getActions(); // get the actions from the Model
      actions.splice(1, 2); // splice out the ones we don't want (were taking them all out here)

      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Applications'); // set the page title
    }

  }
})();
