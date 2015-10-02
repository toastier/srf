var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var applicationModel = new Schema({
    applicant: {
      type: Schema.Types.ObjectId,
      ref: 'Applicant'
    },
    opening: {
      type: Schema.Types.ObjectId,
      ref: 'Opening'
    },
    proceedToReview: {
      type: Boolean,
      default: null
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
      interviews: [
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

