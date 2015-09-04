
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
        applicantPositions: [{
            positionName:           { type: String },
            dateExpectedCompletion: { type: Date },
            note:                   { type: String },
            //TODO institutions will lookup in another schema
            institution: [{
                institutionName: { type: String },
                city: { type: String },
                state: { type: String },
                country: { type: String }
            }]
        }],
        focalAreas: [{
            focalArea: { type: String }
        }],
        resume: [{
            dateUploaded:   { type: Date },
            link:           { type: String },
            note:           { type: String }
        }],
        emailAddresses: [{
            emailAddress:   { type: String },
            primary:        { type: Boolean },
            note:           { type: String }
        }],
        phoneNumbers: [{
            phoneNumber:    { type: String },
            type:           { type: String }, //TODO enumlist
            note:           { type: String },
            primary:        { type: Boolean },
        }],
        addresses: [{
            _id : false,
            type:           { type: String }, //TODO enumList
            address1:       { type: String },
            address2:       { type: String },
            city:           { type: String }, //TODO enumlist
            state:          { type: String }, //TODO enumlist
            postalCode:     { type: String },
            country:        { type: String }, //TODO enumlist
            primary:        { type: Boolean }
        }],
        //addresses:  [Schema.Types.Mixed],
        referralSource: {
            primary: {type: String, default: 'Not specified'},
            specific: { type: String }
        },
        status: {
            current:        { type: Boolean },
            confidential:   { type: Boolean },  //TODO this shouldn't be part of hiring lifecycle
            // TODO revise mock data, reconsider with substatus
            hiringStatus: {
                submitted: {
                    date: {type: Date},
                    note: {type: String}
                },
                phoneScreen: {
                    date: {type: Date},
                    note: {type: String}
                },
                campusVisit: {
                    date: {type: Date},
                    note: {type: String}
                },
                offered: {
                    date: {type: Date},
                    note: {type: String}
                },
                hired: {
                    date: {type: Date},
                    note: {type: String}
                },
                rejected: {
                    date: {type: Date},
                    note: {type: String}
                }
            }
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

