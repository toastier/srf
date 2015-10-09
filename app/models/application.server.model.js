var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var fs = require('fs');
var grid = require('gridfs-stream');;

var applicationModel = new Schema({
    honorific: {
      type: String
    },
    firstName: {
      type: String
    },
    middleName: {
      type: String
    },
    lastName: {
      type: String
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: 'Applicant'
    },
    opening: {
      type: Schema.Types.ObjectId,
      ref: 'Opening'
    },
    cv: {
      type: Schema.Types.ObjectId
    },
    coverLetter: {
      type: Schema.Types.ObjectId
    },
    proceedToReview: {
      type: Boolean,
      default: null
    },
    newApplicant: {
      type: Boolean,
      default: true
    },
    reviewPhase: {
      proceedToPhoneInterview: {
        type: Boolean,
        default: null
      },
      reviews: [
        {
          reviewer: {
            type: Schema.ObjectId,
            ref: 'User'
          },
          reviewWorksheet: {
            complete: {
              type: Boolean,
              default: false
            },
            body: {type: String},
            comments: [
              {commenter: {
                type: Schema.ObjectId,
                ref: 'User'
              },
                comment: {type: String}
              }
            ]
          }
        }
      ]
    },
    phoneInterviewPhase: {
      proceedToOnSite: {
        type: Boolean,
        default: null
      },
      phoneInterviews: [
        {
          interviewer: {
            type: Schema.ObjectId,
            ref: 'User'
          },
          interviewWorksheet: {
            complete: {
              type: Boolean,
              default: false
            },
            body: {type: String},
            comments: [
              {commenter: {
                type: Schema.ObjectId,
                ref: 'User'
              },
                comment: {type: String}
              }
            ]
          }
        }
      ]
    },
    onSiteVisitPhase: {
      type: String
    }
  }
);

var modelName = 'Application';

module.exports = mongoose.model(modelName, applicationModel);
//console.log('Model: ',modelName);

