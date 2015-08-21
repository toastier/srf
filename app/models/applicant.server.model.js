
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
            middleName:     { type: String},
            honorific:      { type: String},
            suffix:         { type: String}
        },
        // this will be a pointer to the Positions schema TODO
        positionAppliedFor: {
            positionName:   { type: String}
        },
    //TODO rename this
        applicantPositions: [{
            positionName:           { type: String },
            dateExpectedCompletion: { type: Date },
            note:                   { type: String },
            //TODO unnecessary layer; fix
            positions: [{
                //TODO institutions will lookup in another schema
                institutions: [{
                    institutionName: { type: String },
                    city: { type: String },
                    state: { type: String },
                    country: { type: String }
                }]
            }]
        }],
        referralSource: {
            primary: {type: String, default: 'Not specified'}
        },
        dateCreated: {
            type: Date,
            default: Date.now
        },
        user: {
            displayName: {
                type: String,
                default: 'Doris DuSon'
            }
        }
    }
);

var modelName = 'Applicant';

module.exports = mongoose.model(modelName, applicantModel);
console.log('Model: ',modelName);

