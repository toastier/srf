(function () {
  'use strict';
  angular
    .module('eoeDataDemographic')
    .factory('EoeDataDemographic', EoeDataDemographic);

  function EoeDataDemographic($resource, $state, $stateParams) {
    var EoeDataDemographic = $resource('eoeDataDemographic/:eoeDataDemographicId', {eoeDataDemographicId: '@_id'}, {
      update: {
        method: 'PUT'
      }
    });

    var methods = {
      editThisEoeDataDemographic: function () {
        $state.go('main.editEoeDataDemographic', {eoeDataDemographicId: $stateParams.eoeDataDemographicId});
      },
      viewThisEoeDataDemographic: function () {
        $state.go('main.viewEoeDataDemographic', {eoeDataDemographicId: $stateParams.eoeDataDemographicId});
      },
      createEoeDataDemographic: function () {
        $state.go('main.createEoeDataDemographic');
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
     * @type {{listEoeDataDemographic: Function, getActions: Function}}
     */
    var modelMethods = {

      listEoeDataDemographic: function () {
        $state.go('main.listEoeDataDemographic');
      },
      getActions: function () {
        var modelActions = [
          {title: 'Create a New EoeDataDemographic', method: methods.createEoeDataDemographic, type: 'button', style: 'btn-add'},
          {title: 'View EoeDataDemographic', method: methods.viewThisEoeDataDemographic, type: 'button', style: 'btn-view'},
          {title: 'Edit EoeDataDemographic', method: methods.editThisEoeDataDemographic, type: 'button', style: 'btn-edit'}
        ];
        return angular.copy(modelActions);
      }
    };

    /**
     * Extend EoeDataDemographic with the methods
     */
    angular.extend(EoeDataDemographic.prototype, itemMethods);

    angular.extend(EoeDataDemographic, modelMethods);


    return EoeDataDemographic;
  }
})();