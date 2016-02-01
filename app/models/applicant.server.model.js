var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicantModel = new Schema({
    name: {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      middleName: {type: String},
      honorific: {type: String},
      suffix: {type: String}
    },
    applicantPositions: [{
      positionName: {type: String},
      dateExpectedCompletion: {type: Date},
      note: {type: String},
      institution: {
        institutionName: {type: String},
        city: {type: String},
        state: {type: String},
        country: {type: String}
      }
    }],
    credentials: [{
      credential: {type: String},
      note: {type: String},
      institution: {type: String},
      year: {type: Number, min: 1920, max: 2030}
    }],
    focalAreas: [{
      focalArea: {type: String}
    }],
    emailAddresses: [{
      emailAddress: {type: String},
      primary: {type: Boolean},
      note: {type: String}
    }],
    phoneNumbers: [{
      phoneNumber: {type: String},
      type: {type: String},
      note: {type: String},
      primary: {type: Boolean}
    }],
    addresses: [{
      type: {type: String}, //TODO enumList
      address1: {type: String},
      address2: {type: String},
      city: {type: String}, //TODO enumlist
      state: {type: String}, //TODO enumlist
      postalCode: {type: String},
      country: {type: String}, //TODO enumlist
      primary: {type: Boolean}
    }],
    dateCreated: {
      type: Date,
      default: Date.now
    },
    user: {
      type: Schema.Types.ObjectId
    }
  }
);

var modelName = 'Applicant';

module.exports = mongoose.model(modelName, applicantModel);

