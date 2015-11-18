'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var openingModel = new Schema({
    name: {
      type: String,
      required: true
    },
    requisitionNumber: {
      type: Number
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
    },
    filled: {
      type: Boolean,
      default: false
    },
    successfulApplication: {
      type: Schema.Types.ObjectId,
      ref: 'Application'
    }
  }
);

module.exports = mongoose.model('Opening', openingModel);
