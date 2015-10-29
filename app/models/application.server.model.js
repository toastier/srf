var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var fs = require('fs');
var grid = require('gridfs-stream');

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
    email: {
      type: String
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: 'Applicant'
    },
    user: {
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
    isNewApplication: {
      type: Boolean,
      default: true
    },
    submitted: {
      type: Boolean,
      default: false
    },
    dateSubmitted: {
      type: Date
    },
    dateCreated: {
      type: Date,
      default: Date.now
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
            body: {
              fields: [
                {
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
                  response: {
                    type: Schema.Types.Mixed
                  }
                }
              ]
            },
            dateAssigned: {
              type: Date
            },
            dateUpdated: {
              type: Date
            },
            dateCompleted: {
              type: Date
            },
            comments: [
              {
                commenter: {
                  type: Schema.ObjectId,
                  ref: 'User'
                },
                comment: {
                  type: String
                },
                dateCreated: {
                  type: Date,
                  default: Date.now
                },
                dateUpdated: {
                  type: Date
                }
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
          phoneInterviewWorksheet: {
            complete: {
              type: Boolean,
              default: false
            },
            body: {type: String},
            dateAssigned: {
              type: Date
            },
            dateUpdated: {
              type: Date
            },
            dateCompleted: {
              type: Date
            },
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
      complete: {
        type: Boolean,
        default: false
      }
    }
  }
);

var modelName = 'Application';

module.exports = mongoose.model(modelName, applicationModel);
//console.log('Model: ',modelName);

