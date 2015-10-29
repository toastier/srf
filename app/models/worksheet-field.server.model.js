var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelName = 'WorksheetField';
var worksheetFieldModel = new Schema({
  name: {
    type: String,
    required: true
  },
  label: String,
  adminDescription: String,
  description: String,
  dateCreated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: false
  },
  fieldType: {
    type: String,
    required: true,
    enum: [
      'input',
      'textarea',
      'select',
      'checkbox',
      'radio'
    ]
  },
  selectOptions: [
    {
      type: String
    }
  ],
  order: {
    type: Number,
    min: 0,
    default: 0
  },
  appliesTo: {
    type: String,
    required: true,
    enum: [
      'reviewWorksheet',
      'phoneInterviewWorksheet'
    ]
  }
});

module.exports = mongoose.model(modelName, worksheetFieldModel);
