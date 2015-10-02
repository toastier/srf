'use strict';
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
    },
    applications: [{
      type: Schema.ObjectId,
      ref: 'Application'
    }],
    offers: [{
      date: {
        type: Date
      },
      offeredTo: {
        type: Schema.ObjectId,
        ref: 'Applicant'
      },
      accepted: {
        type: Boolean
      },
      acceptedDate: {
        type: Date
      },
      declined: {
        type: Boolean
      },
      declinedDate: {
        type: Date
      },
      retracted: {
        type: Boolean
      },
      retractedDate: {
        type: Date
      }
    }]

  }
);

module.exports = mongoose.model('Opening', openingModel);
