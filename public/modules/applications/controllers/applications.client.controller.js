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
    vm.allowManage = allowManage;
    /** @type ColumnDefinition[] **/
    vm.columnDefinitions = [
      {field: 'summary', label: 'Summary', sortable: true, filterable: false, format: 'summary', actions: {
        restrict: allowView,
        actionItems: [
          {
            type: 'manage',
            title: 'Manage Application',
            restrict: vm.allowManage,
            attachedTo: 'item',
            method: 'manageApplication'
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
      {field: 'opening.name', hidden: true, label: 'Opening', filterable: true, sortable: false},
      {field: 'firstName', hidden: true, label: 'First Name', filterable: true, sortable: false },
      {field: 'lastName', hidden: true, label: 'Last Name', filterable: true, sortable: false },
      {field: 'status', label: 'Application Status', filterable: true, sortable: true},
      {field: 'reviewPhase.reviews.reviewer.displayName', label: 'Reviewers', filterable: true, sortable: true},
      {field: 'dateSubmitted', label: 'Submitted On', filterable: false, sortable: true, format: 'standardDate'},
      {field: 'isNewApplication', label: 'New?', filterable: false, sortable: true, format: 'checkMark'}
    ];

    function allowEdit () {
      return vm.user.hasRole(['admin', 'manager']);
    }

    function allowManage () {
      return vm.user.hasRole(['admin', 'manager']);
    }

    function allowView () {
      return vm.user.hasRole(['admin', 'committee member', 'manager']);
    }


    var initialSortOrder = ['-isNewApplication', '-dateSubmitted'];

    activate();

    function activate() {
      Application.query().$promise
        .then(function(result) {
          Messages.addMessage('Applications Loaded', 'success', null, 'dev');
          new CollectionModel('ApplicationsController', result, vm.columnDefinitions, initialSortOrder)
            .then(function(collection) {
              vm.collection = collection;
            });
        })
        .catch(function(err) {
          Messages.addMessage(err.data.message, 'error', 'Problem Loading Applications');
        });

      setupNavigation();
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation

      var actions = Application.getActions(); // get the actions from the Model
      if (vm.user.hasRole(['admin', 'manager'])) {
        actions.splice(1, 2); // splice out the ones we don't want (leaving Create New Application)
      } else {
        actions = []; // not an admin or manager, so we just set actions to an empty array;
      }

      Navigation.actions.addMany(actions); // add the actions to the Navigation service
      Navigation.viewTitle.set('Applications'); // set the page title
    }

  }
})();
