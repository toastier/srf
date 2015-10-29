(function () {
  'use strict';
  angular
    .module('worksheetFields')
    .factory('WorksheetField', WorksheetField);

    function WorksheetField ($resource, $stateParams, Messages, _ ) {
      var worksheetField = $resource('/worksheetFields/:worksheetFieldId', {worksheetFieldId: '@_id'}, {
        update: {
          method: 'PUT'
        }
      });

      function findValueInOptions(value, options) {
        var matched = false;
        _.forEach(options, function(option) {
          if(!matched && option.value === value) {
            matched = option.name;
          }
        });
        return matched;
      }

      /**
       * Constructor for Option
       * @param {String} name
       * @param {String} value
       * @constructor
       */
      function Option (name, value) {
        this.name = name || null;
        this.value = value || null;
      }

      function getAppliesToOptions () {
        return [
          new Option('Review Worksheet', 'reviewWorksheet'),
          new Option('Phone Interview Worksheet', 'phoneInterviewWorksheet')
        ];
      }

      function getFieldTypeOptions () {
        return [
          new Option('Text', 'input'),
          new Option('Multi-line Text', 'textarea'),
          new Option('Select List', 'select'),
          new Option('Checkbox', 'checkbox'),
          new Option('Radio Buttons', 'radio')
        ];
      }

      function getAppliesToHumanName () {
        var options = getAppliesToOptions();
        var humanName = findValueInOptions(this.appliesTo, options);
        if (!humanName) {
          humanName = this.appliesTo;
        }
        return humanName;
      }

      function getFieldTypeHumanName () {
        var options = getFieldTypeOptions();
        var humanName = findValueInOptions(this.fieldType, options);
        if (!humanName) {
          humanName = this.fieldType;
        }
        return humanName;
      }

      var modelMethods = {
        getAppliesToOptions: getAppliesToOptions,
        getFieldTypeOptions: getFieldTypeOptions
      };

      var itemMethods = {
        getAppliesToHumanName: getAppliesToHumanName,
        getFieldTypeHumanName: getFieldTypeHumanName
      };

      _.extend(worksheetField.prototype, itemMethods);
      _.extend(worksheetField, modelMethods);

      return worksheetField;
    }

})();
