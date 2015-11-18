(function () {
  'use strict';

  angular
    .module('applications')
    .directive('duListApplicationsSmartComponent', duListApplicationsSmartComponent);

  /**
   * Provides a 'Smart Component' with isolate scope, which has 5 modes, set through the 'view-mode' attribute on the
   * HTML element in the View where the directive is invoked
   * @example
   <du-list-applications-smart-component view-mode="iAmReviewer"></du-list-applications-smart-component>
   * view-mode can be one of ['iAmReviewer', 'iAmPhoneInterviewer', 'activeForOpening', 'inactiveForOpening'] default behavior is to retrieve 'all'
   */
  function duListApplicationsSmartComponent() {

    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/du-list-applications-smart-component.client.partial.html',
      controller: duListApplicationsSmartComponentController,
      controllerAs: 'vm',
      scope: {
        viewMode: '@',
        openingId: '=',
        applicantId: '='
      },
      bindToController: true,
      replace: true
    };

    function duListApplicationsSmartComponentController($scope, Authentication, Opening, Application, _) {
      /*jshint validthis:true*/
      var vm = this;
      vm.clickAction = clickAction;
      vm.panelSuccess = panelSuccess;
      vm.viewOpening = Opening.viewOpening;

      function panelSuccess() {
        if (!vm.applications) {
          return false;
        }
        switch (vm.viewMode) {
          case 'inactiveForApplicant':
            return false;
          case 'inactiveForOpening':
            return false;
          default:
            return vm.componentTitle !== 'All Open Applications' && vm.applications.length;
        }
      }

      /**
       * Reference to the function to be used for the click action in the view.
       * Changed based on the viewMode of the directive
       * @type {Function}
       */
      var clickFunction = Application.viewApplication;

      activate();

      function activate() {
        vm.componentTitle = 'Applications';
        vm.buttonTitle = 'Edit';
        Authentication.promise
          .then(function (user) {
            vm.user = user;
            if (vm.user.hasRole(['admin', 'committee member', 'manager'])) {
              switch (vm.viewMode) {
                case 'iAmReviewer':
                  iAmReviewer();
                  break;
                case 'iAmPhoneInterviewer':
                  iAmPhoneInterviewer();
                  break;
                case 'activeForOpening':
                  activeForOpening();
                  break;
                case 'inactiveForOpening':
                  inactiveForOpening();
                  break;
                case 'activeForApplicant':
                  activeForApplicant();
                  break;
                case 'inactiveForApplicant':
                  inactiveForApplicant();
                  break;
                case 'allOpen':
                  allOpen();
                  break;
                case 'successfulForOpening':
                  successfulForOpening();
                  break;
                default:
                  allApplications();
              }
            }
          });
      }

      /**
       * Method exposed to the View, in turn calls the assigned clickFunction.
       * @param {Object} application
       */
      function clickAction(application) {
        clickFunction(application);
      }

      /**
       * Gets Applications where the given Applicant is the Applicant for the Application, and the Application is Open
       */
      function activeForApplicant() {
        vm.componentTitle = 'Applicant\'s Open Applications';
        getForApplicant(true);
      }

      /**
       * Gets Open Applications for the given Opening
       */
      function activeForOpening() {
        vm.componentTitle = 'Open Applications';
        vm.buttonTitle = 'View';
        $scope.$watch('vm.openingId', function (newVal) {
          if (_.isString(newVal)) {
            Application.forOpening({
              openingId: vm.openingId,
              isActive: true
            }).$promise
              .then(function (applications) {
                vm.applications = applications;
              });
          }
        });
      }

      /**
       * Gets all Applications
       */
      function allOpen() {
        vm.componentTitle = 'All Open Applications';
        vm.buttonTitle = 'View';
        Application.allOpen().$promise
          .then(function (applications) {
            vm.applications = applications;
          });
      }

      /**
       * Gets all Applications
       */
      function allApplications() {
        vm.componentTitle = 'All Applications';
        vm.buttonTitle = 'View';
        Application.query().$promise
          .then(function (applications) {
            vm.applications = applications;
          });
      }

      /**
       * Gets Data for Applicant based modes
       * @param {Boolean} isActive
       */
      function getForApplicant(isActive) {
        vm.buttonTitle = 'View';
        $scope.$watch('vm.applicantId', function (newVal) {
          if (_.isString(newVal)) {
            Application.forApplicant({
              applicantId: vm.applicantId,
              isActive: isActive
            }).$promise
              .then(function (applications) {
                vm.applications = applications;
              });
          }
        });
      }

      /**
       * Gets Applications where the current use is a reviewer, and their Review is incomplete
       */
      function iAmReviewer() {
        vm.componentTitle = 'Reviews I Need to Complete';
        vm.buttonTitle = 'Review';
        clickFunction = Application.conductReview;
        Application.iAmReviewer().$promise
          .then(function (applications) {
            vm.applications = applications;
          });
      }

      /**
       * Gets Applications where the current use is a Phone Interviewer, and their Phone Interview is incomplete
       */
      function iAmPhoneInterviewer() {
        vm.componentTitle = 'Phone Interviews I Need to Conduct';
        vm.buttonTitle = 'Interview';
        clickFunction = Application.conductPhoneInterview;
        Application.iAmPhoneInterviewer().$promise
          .then(function (applications) {
            vm.applications = applications;
          });
      }

      /**
       * Gets Applications where the given Applicant is the Applicant for the Application, and the Application is Closed
       */
      function inactiveForApplicant() {
        vm.componentTitle = 'Applicant\'s Closed Applications';
        getForApplicant(false);
      }

      /**
       * Gets Closed Applications for the given Opening
       */
      function inactiveForOpening() {
        vm.componentTitle = 'Closed Applications';
        vm.buttonTitle = 'View';
        $scope.$watch('vm.openingId', function (newVal) {
          if (_.isString(newVal)) {
            Application.forOpening({
              openingId: vm.openingId,
              isActive: false
            }).$promise
              .then(function (applications) {
                vm.applications = applications;
              });
          }
        });
      }

      function successfulForOpening() {
        vm.componentTitle = 'Successful Application';
        vm.buttonTitle = 'View';
        $scope.$watch('vm.openingId', function (newVal) {
          if (_.isString(newVal)) {
            Application.successfulForOpening({
              openingId: vm.openingId
            }).$promise
              .then(function (application) {
                vm.applications = [];
                vm.applications.push(application);
              });
          }
        });
      }
    }
  }
})();

