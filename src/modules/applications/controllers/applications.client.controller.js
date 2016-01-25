(function () {
  'use strict';
  angular
    .module('applications')
    .controller('ApplicationsController', ApplicationsController);

  function ApplicationsController(Navigation, CollectionModel, resolvedAuth, Messages, Application, Filtering) {
    var vm = this;
    var viewTitle = 'Open Applications';
    vm.viewMode = 'open';
    vm.user = resolvedAuth;
    vm.allowEdit = allowEdit;
    vm.allowView = allowView;
    vm.allowManage = allowManage;
    vm.getApplications = getApplications;
    /** @type ColumnDefinition[] **/
    vm.columnDefinitions = [
      {label: 'Actions', width: { xs: 1 }, actions: {
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
      {field: 'summary', label: 'Summary', width: { xs: 3 }, sortable: true, filterable: false, format: 'summary'},
      {field: 'opening.name', hidden: true, label: 'Opening',  filterable: true, sortable: false},
      {field: 'firstName', hidden: true, label: 'First Name',  filterable: true, sortable: false},
      {field: 'lastName', hidden: true, label: 'Last Name',  filterable: true, sortable: false},
      {field: 'status', label: 'Application Status', width: { xs: 1 }, filterable: true, sortable: true},
      {field: 'reviewPhase.reviews.reviewer.displayName', width: { xs: 2 }, label: 'Reviewers', filterable: true, sortable: true},
      {field: 'dateSubmitted', label: 'Submitted On', width: { xs: 2 }, filterable: false, sortable: true, format: 'standardDate'},
      {field: 'isNewApplication', label: 'New?', width: { xs: 1 }, filterable: false, sortable: true, format: 'checkMark'}
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
      getApplications();
      setupNavigation();
    }

    function getApplications(viewMode) {
      var query;
      vm.viewMode = viewMode || 'open';

      switch (vm.viewMode) {
        case 'all':
          query = Application.query();
          viewTitle = 'All Applications';
          break;
        case 'closed':
          query = Application.allClosed();
          viewTitle = 'Un-successful Applications';
          break;
        case 'notSubmitted':
          query = Application.allNotSubmitted();
          viewTitle = 'Applications Not Submitted';
          break;
        case 'phoneInterview':
          query = Application.allPhoneInterviewPhase();
          viewTitle = 'Applications in Phone Interview Phase';
          break;
        case 'review':
          query = Application.allReviewPhase();
          viewTitle = 'Applications in Review Phase';
          break;
        case 'onSiteVisit':
          query = Application.allOnSiteVisitPhase();
          viewTitle = 'Applications in On-Campus Visit Phase';
          break;
        case 'successful':
          query = Application.allSuccessful();
          viewTitle = 'Successful Applications';
          break;
        case 'legacy':
          query = Application.allLegacy();
          viewTitle = 'Legacy Applications';
          break;
        default:
          query = Application.allOpen();
          viewTitle = 'Open Applications';
      }

      Navigation.viewTitle.set(viewTitle);

      query.$promise
        .then(function(result) {
          Messages.addMessage('Applications Loaded', 'success', null, 'dev');
          vm.collection.filterCriteria = {};
          new CollectionModel('ApplicationsController', result, vm.columnDefinitions, initialSortOrder)
            .then(function(collection) {
              vm.collection = collection;
            });
        })
        .catch(function(err) {
          Messages.addMessage(err.data.message, 'error', 'Problem Loading Applications');
        });

      function getAll() {

      }
      function getOpen() {

      }
      function getClosed() {

      }
      function getNotSubmitted() {

      }
    }

    function setupNavigation() {
      Navigation.clear(); // clear everything in the Navigation

      var actions = Application.getActions(); // get the actions from the Model
      if (vm.user.hasRole(['admin', 'manager'])) {
        actions.splice(0, 3); // splice out the ones we don't want (leaving Create New Application)
      } else {
        actions = []; // not an admin or manager, so we just set actions to an empty array;
      }

      Navigation.actions.addMany(actions); // add the actions to the Navigation service
    }

  }



})();


