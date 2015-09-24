var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var openingModel = new Schema({
    dateCreated: {
      type: Date,
      default: Date.now()
    },
    isActive: {
      type: Boolean,
      default: true
    },
    dateOpen: {
      type: Date
    },
    dateClose: {
      type: Date
    },
    postingLink: [{
      source: {
        type: String, enum: ['DUSON', 'Other']
      },
      url: {
        type: String
      }
    }],
    position: {
      type: Schema.ObjectId,
      ref: 'Position'
    }
  }
);

module.exports = mongoose.model('Opening', openingModel);
