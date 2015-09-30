(function () {
  'use strict';
  angular
    .module('applications')
    .factory('Application', Application);

  function Application($resource, $state, $stateParams) {
    var application = $resource('applications/:applicationId', {applicationId: '@_id'}, {
      update: {
        method: 'PUT'
      }
    });

    /**
     * Methods that are not returned directly, but used by other methods
     * @type {{editThisApplication: Function, viewThisApplication: Function, createApplication: Function}}
     */
    var methods = {
      editThisApplication: function () {
        $state.go('main.editApplication', {applicationId: $stateParams.applicationId});
      },
      viewThisApplication: function () {
        $state.go('main.viewApplication', {applicationId: $stateParams.applicationId});
      },
      createApplication: function () {
        $state.go('main.createApplication');
      }
    };
    
    /**
     * Methods to add to each result returned by $resource
     * @type {Object} itemMethods
     */
    var itemMethods = {
      /**
       * @param {Application} applicationObject Named as such to avoid shadowing
       */
      editApplication: function (applicationObject) {
        $state.go('main.editApplication', {applicationId: applicationObject._id});
      },
      /**
       * @param {Application} applicationObject Named as such to avoid shadowing
       */
      viewApplication: function (applicationObject) {
        $state.go('main.viewApplication', {applicationId: applicationObject._id});
      }
    };

    /**
     * Methods to add to the Model
     * @type {Object} modelMethods
     */
    var modelMethods = {
      listApplications: function () {
        $state.go('main.listApplications');
      },
      getActions: function () {
        var modelActions = [
          {title: 'Create a New Application', method: methods.createApplication, type: 'button', style: 'btn-add'},
          {title: 'View Application', method: methods.viewThisApplication, type: 'button', style: 'btn-view'},
          {title: 'Edit Application', method: methods.editThisApplication, type: 'button', style: 'btn-edit'}
        ];
        return angular.copy(modelActions);
      }
    };
    
    angular.extend(application.prototype, itemMethods);
    angular.extend(application, modelMethods);
    return application;
  }
})();
