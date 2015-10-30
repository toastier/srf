(function () {
  'use strict';
  angular
    .module('worksheetFields')
    .controller('AddEditWorksheetFieldModalController', AddEditWorksheetFieldModalController);

  function AddEditWorksheetFieldModalController($modalInstance, Messages, WorksheetField, existingWorksheetField, _) {

    var vm = this;
    vm.modalTitle = 'Add a Worksheet Field';
    vm.addSelectOption = addSelectOption;
    vm.options = {};
    vm.options.appliesToOptions = WorksheetField.getAppliesToOptions();
    vm.options.fieldTypeOptions = WorksheetField.getFieldTypeOptions();
    vm.removeSelectOption = removeSelectOption;
    vm.saveField = saveField;
    vm.cancel = cancel;
    vm.newOption = '';

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

    function addSelectOption() {
      if (vm.newOption) {
        if(!_.isArray(vm.worksheetField.selectOptions)) {
          vm.worksheetField.selectOptions = [];
        }
        vm.worksheetField.selectOptions.push(vm.newOption);
        vm.newOption = '';
      }
    }

    function cancel() {
      vm.worksheetField = vm.worksheetFieldOriginal;
      $modalInstance.dismiss(false);
    }

    function removeSelectOption(option) {
      var options = vm.worksheetField.selectOptions;
      options.splice(options.indexOf(option), 1);
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
