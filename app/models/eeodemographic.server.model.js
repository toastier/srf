var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var eeoDemographicModel = new Schema({
    opening: {
        type: Schema.Types.ObjectId,
        ref: 'Opening'
    },
    position: {
        type: Schema.Types.ObjectId,
        ref: 'Position'
    },
    reportType: {
        type: String,
        enum: ['self', 'interview']
    },
    gender: {
      type: String, enum: ['f', 'm', 'd']
    },
    ethnicity: {
      type: String, enum: ['h', 'n', 'd']
    },
    race: {
      native: {
        type: Boolean
      },
      asian: {
        type: Boolean
      },
      black: {
        type: Boolean
      },
      pacific: {
        type: Boolean
      },
      white: {
        type: Boolean
      },
      other: {
        type: Boolean
      },
      declined: {
        type: Boolean
      }
    },
    dateCreated: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'eeoDemographic'
  }
);


var modelName = 'EeoDemographic';

module.exports = mongoose.model(modelName, eeoDemographicModel);

