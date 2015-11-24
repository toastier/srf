var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var eeoVeteranModel = new Schema({
    opening: {
      type: Schema.Types.ObjectId,
      ref: 'Opening'
    },
    position: {
        type: Schema.Types.ObjectId,
        ref: 'Position'
    },
    veteran: {
      type: String, enum: ['yes-id', 'yes-not-id', 'no', 'declined']
    },
    gender: {
        type: String, enum: ['f', 'm', 'd']
    },
    vetClass: {
      disabled: {
        type: Boolean
      },
      recent: {
        type: Boolean
      },
      active: {
        type: Boolean
      },
      medal: {
        type: Boolean
      }
    },
    dateCreated: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'eeoVeteran'
  }
);

var modelName = 'EeoVeteran';

module.exports = mongoose.model(modelName, eeoVeteranModel);

