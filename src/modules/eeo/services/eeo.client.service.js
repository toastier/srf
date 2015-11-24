(function () {
  'use strict';
  angular
    .module('eeo')
    .factory('Eeo', Eeo);

  function Eeo($resource, $state, $stateParams) {
    var Eeo = $resource('eeo/:eeoId', {eeoId: '@_id'}, {
      update: {
        method: 'PUT'
      },
      create: {
        method: 'POST',
        url: 'eeo/create/:applicationId',
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
      createEeo: function () {
        $state.go('main.createEeo', {applicationID: $stateParams.applicationID});
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
     * @type {{listEeo: Function, getActions: Function}}
     */
    var modelMethods = {

      listEeo: function () {
        $state.go('main.listEeo');
      },
      getActions: function () {
        var modelActions = [
        ];
        return angular.copy(modelActions);
      }
    };

    /**
     * Extend Eeo with the methods
     */
    angular.extend(Eeo.prototype, itemMethods);

    angular.extend(Eeo, modelMethods);


    return Eeo;
  }
})();