(function () {
  'use strict';
  angular
    .module('worksheetFields')
    .controller('AddEditWorksheetFieldModalController', AddEditWorksheetFieldModalController);

  function AddEditWorksheetFieldModalController($modalInstance, Messages, WorksheetField, existingWorksheetField) {

    var vm = this;
    vm.modalTitle = 'Add a Worksheet Field';
    vm.options = {};
    vm.options.appliesToOptions = WorksheetField.getAppliesToOptions();
    vm.options.fieldTypeOptions = WorksheetField.getFieldTypeOptions();
    vm.saveField = saveField;
    vm.cancel = cancel;

    activate();

    function activate() {
      if (existingWorksheetField) {
        vm.modalTitle = 'Edit Worksheet Field';
        vm.worksheetFieldOriginal = existingWorksheetField;
      } else {
        vm.worksheetFieldOriginal = new WorksheetField();
      }

      vm.worksheetField = angular.copy(vm.worksheetFieldOriginal);
    }

    function cancel() {
      vm.worksheetField = vm.worksheetFieldOriginal;
      $modalInstance.dismiss(false);
    }

    function saveField() {
      if(vm.worksheetField._id) {

        WorksheetField.update(vm.worksheetField).$promise
          .then(function(worksheetField) {
            Messages.addMessage('Field Saved');
            $modalInstance.close(worksheetField);
          })
          .catch(function (err) {
            Messages.addMessage(err.data.message, 'error');
            $modalInstance.dismiss(false);
          });
      } else {
        vm.worksheetField.$save()
          .then(function(worksheetField) {
            Messages.addMessage('Field Saved');
            $modalInstance.close(worksheetField);
          })
          .catch(function (err) {
            Messages.addMessage(err.data.message, 'error');
            $modalInstance.dismiss(false);
          });
      }
    }

  }
})();
