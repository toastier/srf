var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var openingModel = new Schema({
    name: {
      type: String,
      required: true
    },
    details: {
      type: String
    },
    dateCreated: {
      type: Date,
      default: Date.now()
    },
    isActive: {
      type: Boolean,
      default: true
    },
    dateStart: {
      type: Date
    },
    dateClose: {
      type: Date
    },
    datePosted: {
      type: Date
    },
    dateRequested: {
      type: Date
    },
    postingLink: [{
      source: {
        type: String
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
