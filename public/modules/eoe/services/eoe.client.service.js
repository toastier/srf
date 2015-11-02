(function () {
  'use strict';
  angular
    .module('eoe')
    .factory('Eoe', Eoe);

  function Eoe($resource, $state, $stateParams) {
    var Eoe = $resource('eoe/:eoeId', {eoeId: '@_id'}, {
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST',
        url: 'eoe/create/:applicationId',
        params: { applicationId : '@applicationId'}
      }
    });

    var methods = {
      editThisEoe: function () {
        $state.go('main.editEoe', {eoeId: $stateParams.eoeId});
      },
      viewThisEoe: function () {
        $state.go('main.viewEoe', {eoeId: $stateParams.eoeId});
      },
      createEoe: function () {
        $state.go('main.createEoe', {applicationID: $stateParams.applicationID});
      }
    };

    /**
     * Methods to add to each result returned by $resource
     * @type {Object} itemMethods
     */
    var itemMethods = {

    };

    /**
     * Methods to add to the Model
     * @type {{listEoe: Function, getActions: Function}}
     */
    var modelMethods = {

      listEoe: function () {
        $state.go('main.listEoe');
      },
      getActions: function () {
        var modelActions = [
          {title: 'Create a New Eoe', method: methods.createEoe, type: 'button', style: 'btn-add'},
          {title: 'View Eoe', method: methods.viewThisEoe, type: 'button', style: 'btn-view'},
          {title: 'Edit Eoe', method: methods.editThisEoe, type: 'button', style: 'btn-edit'}
        ];
        return angular.copy(modelActions);
      }
    };

    /**
     * Extend Eoe with the methods
     */
    angular.extend(Eoe.prototype, itemMethods);

    angular.extend(Eoe, modelMethods);


    return Eoe;
  }
})();