var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var eeoDisabilityModel = new Schema({
    opening: {
      type: Schema.Types.ObjectId,
      ref: 'Opening'
    },
    position: {
        type: Schema.Types.ObjectId,
        ref: 'Position'
    },
    gender: {
        type: String, enum: ['f', 'm', 'd']
    },
    disability: {
      type: String, enum: ['y', 'n', 'd']
    },
    dateCreated: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'eeoDisability'
  }
);

var modelName = 'EeoDisability';

module.exports = mongoose.model(modelName, eeoDisabilityModel);

