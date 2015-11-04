(function () {
  'use strict';

  angular
    .module('applications')
    .directive('duListApplicationsSmartComponent', duListApplicationsSmartComponent);

  /**
   * Provides a 'Smart Component' with isolate scope, which has 3 modes, set through the 'view-mode' attribute on the
   * HTML element in the View where the directive is invoked
   * @example
   <du-list-applications-smart-component view-mode="iAmReviewer"></du-list-applications-smart-component>
   * view-mode can be one of ['iAmReviewer', 'iAmPhoneInterviewer'] default behavior is to retrieve 'all'
   */
  function duListApplicationsSmartComponent() {

    return {
      restrict: 'E',
      templateUrl: 'modules/applications/directives/partials/du-list-applications-smart-component.client.partial.html',
      controller: duListApplicationsSmartComponentController,
      controllerAs: 'vm',
      scope: {
        viewMode: '@',
        openingId: '='
      },
      bindToController: true,
      replace: true
    };

    function duListApplicationsSmartComponentController($scope, Authentication, Application, _) {
      var vm = this;
      vm.clickAction = clickAction;

      /**
       * Reference to the function to be used for the click action in the view.
       * Changed based on the viewMode of the directive
       * @type {Function}
       */
      var clickFunction = Application.viewApplication;

      activate();

      /**
       * Method exposed to the View, in turn calls the assigned clickFunction.
       * @param application
       */
      function clickAction (application) {
        clickFunction(application);
      }

      function iAmReviewer() {
        vm.componentTitle = 'Reviews I Need to Complete';
        vm.buttonTitle = 'Review';
        clickFunction = Application.conductReview;
        Application.iAmReviewer().$promise
          .then(function (applications) {
            vm.applications = applications;
          });
      }

      function iAmPhoneInterviewer() {
        vm.componentTitle = 'Phone Interviews I Need to Conduct';
        vm.buttonTitle = 'Interview';
        clickFunction = Application.conductPhoneInterview;
        Application.iAmPhoneInterviewer().$promise
          .then(function (applications) {
            vm.applications = applications;
          });
      }

      function allApplications() {
        vm.componentTitle = 'All Open Applications';
        vm.buttonTitle = 'View';
        Application.query().$promise
          .then(function (applications) {
            vm.applications = applications;
          });
      }

      function activeForOpening() {
        vm.componentTitle = 'Open Applications';
        vm.buttonTitle = 'View';
        $scope.$watch('vm.openingId', function (newVal) {
          if(_.isString(newVal)) {
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

      function inactiveForOpening() {
        vm.componentTitle = 'Closed Applications';
        vm.buttonTitle = 'View';
        $scope.$watch('vm.openingId', function (newVal) {
          if(_.isString(newVal)) {
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

      function activate() {
        vm.componentTitle = 'Applications';
        vm.buttonTitle = 'Edit';
        Authentication.promise
          .then(function (user) {
            vm.user = user;
            if(vm.user.hasRole(['admin', 'committee member', 'manager'])) {
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
                default:
                  allApplications();
              }
            }
          });
      }
    }
  }
})();

