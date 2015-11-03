(function () {
  'use strict';
  angular
    .module('worksheetFields')
    .controller('WorksheetFieldsController', WorksheetFieldsController);

  function WorksheetFieldsController($modal, resolvedAuth, Messages, Navigation, WorksheetField) {

    var vm = this;
    vm.user = resolvedAuth;
    vm.worksheetFields = [];
    vm.WorksheetField = new WorksheetField();
    vm.options = {};
    vm.options.appliesToOptions = WorksheetField.getAppliesToOptions();
    vm.cloneWorksheetField = cloneWorksheetField;
    vm.collectionOrderChanged = false;
    vm.switchWorksheetType = getData;
    vm.deleteField = deleteField;
    vm.dragControlListeners = {
      orderChanged: sortableOrderChanged
    };
    vm.fieldsNotReordered = fieldsNotReordered;
    vm.openAddFieldModal = openAddFieldModal;
    vm.saveAll = saveAll;
    vm.selectedWorksheetType = 'reviewWorksheet';
    var orderChanged = false;

    activate();

    ////////////////

    function activate() {
      getData();
      setupNavigation();
    }

    function deleteField(field) {
      field.$delete()
        .then(function() {
          getData();
          Messages.addMessage('The field was deleted');
        });
    }

    function cloneWorksheetField(field) {
      var cloneField = angular.copy(field);
      delete cloneField._id;
      cloneField.$save()
        .then(function() {
          getData();
        });
    }

    function fieldsNotReordered() {
      return !fieldsReordered();
    }

    function fieldsReordered(hasChanged) {
      if(hasChanged !== undefined && hasChanged !== null) {
        orderChanged = hasChanged;
      }
      return orderChanged;
    }

    function getData() {
      WorksheetField.byType({appliesTo: vm.selectedWorksheetType}).$promise
        .then(function(worksheetFields) {
          vm.worksheetFields = worksheetFields;
        })
        .catch(function (err) {
          Messages.addMessage(err.data.message, 'error');
        });
    }

    function openAddFieldModal (existingWorksheetField) {
      var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'modules/worksheet-fields/partials/add-edit-worksheet-field-modal.client.partial.html',
          controller: 'AddEditWorksheetFieldModalController',
          controllerAs: 'vm',
          bindToController: true,
          size: 'md',
          resolve: {
            existingWorksheetField: function () {
              return existingWorksheetField;
            },
            selectedWorksheetType: function () {
              return vm.selectedWorksheetType;
            }
          }
        }
      );

      modalInstance.result
        .then(function(result) {
          if (result) {
            getData();
          }
        });
    }

    function sortableOrderChanged(event) {
      var fieldId = event.source.itemScope.modelValue._id;
      var destinationIndex = event.dest.index;
      reorderWorksheetFields(fieldId, destinationIndex);
    }

    function reorderWorksheetFields(fieldId, destinationIndex) {
      var index = 0;
      angular.forEach(vm.worksheetFields, function(worksheetField) {
        if(fieldId !== worksheetField._id) { //if this is not the field being moved
          if (destinationIndex === index) { //if the position of this item is the same as the destination of the item being moved
            index++;
          }
          worksheetField.order = index;
          index++;
        } else {
          worksheetField.order = destinationIndex; //if this is the item being moved
        }
      });
      fieldsReordered(true);
    }

    function saveAll() {
      angular.forEach(vm.worksheetFields, function(worksheetField) {
        WorksheetField.update(worksheetField);
      });
      Messages.addMessage('Reordering was saved', 'success');
      fieldsReordered(false);
    }

    function setupNavigation() {
      Navigation.clear();
      var controllerActions = [
        {title: 'Add a Field', method: vm.openAddFieldModal, type: 'button', style: 'btn-add'},
        {title: 'Save Order Changes', method: vm.saveAll, type: 'button', style: 'btn-save', disableIf: vm.fieldsNotReordered}
      ];
      Navigation.actions.addMany(controllerActions);
      Navigation.viewTitle.set('Worksheet Fields');
    }
  }
})();
