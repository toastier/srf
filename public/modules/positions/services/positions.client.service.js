(function () {
  'use strict';
  angular
    .module('positions')
    .factory('Position', Position);

  function Position($resource, $state, $stateParams) {
    var Position = $resource('positions/:positionId', {positionId: '@_id'}, {
      update: {
        method: 'PUT'
      }
    });

    var methods = {
      editThisPosition: function () {
        $state.go('editPosition', {positionId: $stateParams.positionId});
      },
      viewThisPosition: function () {
        $state.go('viewPosition', {positionId: $stateParams.positionId});
      },
      createPosition: function () {
        $state.go('createPosition');
      }
    };

    /**
     * Methods to add to each result returned by $resource
     * @type {Object} itemMethods
     */
    var itemMethods = {
      editPosition: function (position) {
        $state.go('editPosition', {positionId: position._id});
      },
      viewPosition: function (position) {
        $state.go('viewPosition', {positionId: position._id});
      }
    };

    var modelMethods = {
      listPositions: function () {
        $state.go('listPositions');
      },
      getActions: function () {
        var modelActions = [
          {title: 'Create a New Position', method: methods.createPosition, type: 'button', style: 'btn-add'},
          {title: 'View Position', method: methods.viewThisPosition, type: 'button', style: 'btn-view'},
          {title: 'Edit Position', method: methods.editThisPosition, type: 'button', style: 'btn-edit'}
        ];
        return angular.copy(modelActions);
      }
    };

    /**
     * Extend Position with the methods
     */
    angular.extend(Position.prototype, itemMethods);

    angular.extend(Position, modelMethods);


    return Position;
  }
})();