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

    var valueOptions = {
      ethnicities: [{
        code: 'h',
        description: 'Hispanic or Latino',
        detail: 'Of Cuban, Mexican, Puerto Rican, South or Central American, or other Spanish culture or origin regardless of race.'
        },
        {
          code: 'n',
          description: 'Not Hispanic or Latino'
        },
        {
          code: 'd',
          description: 'Declined to Answer'
        }
          ]

    };

    var methods = {
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