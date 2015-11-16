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
      {field: 'name.honorific', label: 'Hon', filterable: true, actions: {
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
      {field: 'name.firstName', label: 'First Name', filterable: true},
      {field: 'name.lastName', label: 'Last Name', filterable: true}
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
