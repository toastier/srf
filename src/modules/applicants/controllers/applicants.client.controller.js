(function () {
  'use strict';
  angular
    .module('applicants')
    .controller('ApplicantsController', ApplicantsController);

  function ApplicantsController(Navigation, resolvedAuth, Applicant, CollectionModel, Messages) {
    var vm = this;
    vm.user = resolvedAuth;
    vm.allowEdit = allowEdit;
    vm.columnDefinitions = [
      {label: 'Actions', width: { sm: 1 }, actions: {
        restrict: vm.allowEdit,
        actionItems: [
          {
            type: 'edit',
            title: 'Edit Applicant',
            restrict: vm.allowEdit,
            attachedTo: 'item',
            method: 'editApplicant'
          },
          {
            type: 'view',
            title: 'View Applicant',
            restrict: vm.allowEdit,
            attachedTo: 'item',
            method: 'viewApplicant'
          }
        ]
      }},
      {field: 'name.honorific', label: 'Hon', width: { xs: 0, sm: 1 }, filterable: true},
      {field: 'name.firstName', label: 'First Name', width: { sm: 2 }, sortable: false, filterable: true},
      {field: 'name.middleName', label: 'Middle', width: { sm: 1 },sortable: false,filterable: false},
      {field: 'name.lastName', label: 'Last Name', width: { sm: 3 }, sortable: false,filterable: true},
      {field: 'dateCreated', label: 'Created', width: { sm: 2 }, format: 'date', sortable: false, filterable: false}

    ];

    var initialSortOrder = ['+name.lastName'];

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation
      Navigation.viewTitle.set('Applicants'); // set the page title
    }

    function allowEdit () {
      return vm.user.hasRole(['admin', 'manager']);
    }

    activate();

    function activate() {
      Applicant.query().$promise
        .then(function (result) {
          Messages.addMessage('Applicants Loaded', 'success');
          vm.applicants = result;
          new CollectionModel('ApplicantsController', result, vm.columnDefinitions, initialSortOrder)
            .then(function(collection) {
              vm.collection = collection;
            });
        })
        .catch(function (error) {
          Messages.addMessage(error.data.message, 'error');
        });
      setupNavigation();
    }
  }
})();
