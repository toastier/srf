/**
 * @ngdoc directive
 * @description Provides simple Directive to render a Bootstrap styled display of a field value with a label.
 * The attributes 'field-model' and 'field-label' are required.  'field-columns' will default to 3 if not given.
 * 'field-format' can be any named Angular filter (including your own filters), and will be ignored if not provided.
 * @example
 * <du-display-field field-model"vm.application.opening.dateStart" field-label="Start Date" field-columns="3" field-format="standardDate"></du-display-field>
 */
(function () {
  'use strict';

  angular
    .module('core')
    .directive('duDisplayField', duDisplayField);

  /* @ngInject */
  function duDisplayField() {

    return {
      restrict: 'E',
      replace: 'true',
      templateUrl: 'modules/core/directives/partials/du-display-field.client.partial.html',
      controller: duDisplayFieldController,
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        fieldModel: '=',
        fieldLabel: '@',
        fieldColumns: '@',
        fieldFormat: '@'
      }
    };

    function duDisplayFieldController($scope, $filter) {
      var vm = this;

      activate();

      function activate() {

        if(!vm.fieldLabel) {
          vm.fieldLabel = 'Label Me!';
        }

        if(!vm.fieldColumns) {
          vm.fieldColumns = 3;
        }

        if(vm.fieldFormat) {
          $scope.$watch('vm.fieldModel', function() {
            vm.fieldModel = $filter(vm.fieldFormat)(vm.fieldModel);
          });
        }
      }
    }
  }
})();

